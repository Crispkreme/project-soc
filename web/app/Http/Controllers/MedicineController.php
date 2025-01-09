<?php

namespace App\Http\Controllers;

use App\Contracts\LedgerContract;
use App\Contracts\MedicalRecordContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use App\Models\Medicine;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class MedicineController extends Controller
{
    protected $medicineContract;
    protected $medicalRecordContract;
    protected $ledgerContract;
    protected $medicationContract;

    public function __construct(
        MedicineContract $medicineContract,
        MedicalRecordContract $medicalRecordContract,
        LedgerContract $ledgerContract,
        MedicationContract $medicationContract
    ) {
        $this->medicineContract = $medicineContract;
        $this->medicalRecordContract = $medicalRecordContract;
        $this->ledgerContract = $ledgerContract;
        $this->ledgerContract = $ledgerContract;
        $this->medicationContract = $medicationContract;
    }

    public function getAllMedicine()
    {
        $medicines = $this->medicineContract->getAllMedicine();

        return Inertia::render('Admins/Medicines/Medicine', [
            'medicines' => $medicines,
        ]);
    }

    public function updateOrCreateMedicine(Request $request, $id = null)
    {   
        try {

            DB::beginTransaction();

            $data = $request->validate([
                'medicine_name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('medicines', 'medicine_name')->ignore($id),
                ],
                'description' => 'nullable|string',
            ]);
            
            if ($id) {
                $data['id'] = $id; 
                $this->medicineContract->createOrUpdateMedicine($data);
            } else {
                $this->medicineContract->createOrUpdateMedicine($data);
            }

            DB::commit();
            
            return redirect()->back()->with('success', 'Medicine saved successfully!');

        } catch (Exception $e) {

            Log::error('Error during updateOrCreateMedicine: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Error please try again.');
        }
    }

    public function deleteMedicine($id)
    {
        DB::beginTransaction();
        
        try {
            
            $this->medicineContract->deleteMedicine($id);

            DB::commit();
            
            return redirect()->back()->with('success', 'Medicine deleted successfully!');

        } catch (Exception $e) {

            Log::error('Error during deleteMedicine: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'An error occurred during deleteMedicine.');
        }
    }

    public function searchMedicine(Request $request)
    {
        $query = $request->input('query');
        $medicines = $this->medicalRecordContract->searchMedicine($query);
        return response()->json($medicines);
    }   

    public function getAllMedicineMobile()
    {
        $medicines = $this->medicineContract->getAllMedicine();

        return response()->json($medicines);
    }

    public function getAllInventoryMedicineMobile()
    {
        $medicines = $this->ledgerContract->getAllLedgerMedicine();

        return response()->json($medicines);
    }

    public function getAllMedicineRequesterMobile($userId)
    {
        $medicineRequester = $this->medicationContract->getMedicationById($userId);
        return response()->json($medicineRequester);
    }
}
