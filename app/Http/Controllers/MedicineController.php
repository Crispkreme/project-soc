<?php

namespace App\Http\Controllers;

use App\Contracts\MedicineContract;
use App\Models\Medicine;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class MedicineController extends Controller
{
    protected $medicineContract;

    public function __construct(
        MedicineContract $medicineContract,
    ) {
        $this->medicineContract = $medicineContract;
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
        DB::beginTransaction();

        $data = $request->validate([
            'medicine_name' => 'required|string|max:255|unique:'.Medicine::class,
            'description' => 'nullable|string',
        ]);
        
        try {
            
            if ($id) {
                $data['id'] = $id; 
                $this->medicineContract->createOrUpdateMedicine($data);
            } else {
                $this->medicineContract->createOrUpdateMedicine($data);
            }

            DB::commit();
            
            Session::flash('success', 'Medicine saved successfully!');

        } catch (Exception $e) {

            Log::error('Error during updateOrCreateMedicine: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            Session::flash('error', 'An error occurred during updateOrCreateMedicine.');
            return redirect()->back();
        }
    }

    public function getMedicineById($id)
    {
        $medicine = $this->medicineContract->getMedicineById($id);
        dd($medicine);
    }
}
