<?php

namespace App\Http\Controllers;

use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class InventoryController extends Controller
{
    protected $inventoryContract;
    protected $ledgerContract;
    protected $medicineContract;
    protected $medicationContract;

    public function __construct(
        InventoryContract $inventoryContract,
        LedgerContract $ledgerContract,
        MedicineContract $medicineContract,
        MedicationContract $medicationContract,
    ) {
        $this->inventoryContract = $inventoryContract;
        $this->ledgerContract = $ledgerContract;
        $this->medicineContract = $medicineContract;
        $this->medicationContract = $medicationContract;
    }

    public function getAllInventory()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $inventories = $this->ledgerContract->getAllLedger();
        $medicines = $this->medicineContract->getAllMedicineName();

        return Inertia::render('Admins/Inventories/Inventory', [
            'inventories' => $inventories,
            'medicines' => $medicines,
        ]);
    }

    public function createInventory(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();
        
        try {

            $data = $request->validate([
                'medicine_id' => 'nullable|exists:medicines,id',
                'sold' => 'nullable|integer|min:0',
            ]);

            $data['encode_by_id'] = $user->id; 
            $data['usage'] = $request->description;
            $data['quantity'] = $request->in_stock;

            $this->inventoryContract->createOrUpdateInventory($data);
            
            $ledgers = $this->ledgerContract->getLedgerByMedicineId($data['medicine_id']);
            
            $inStock = ($data['quantity'] ?? 0) + ($ledgers->in_stock ?? 0);
            $sold = $ledgers->sold ?? 0;

            $ledgerData = [
                'medicine_id' => $data['medicine_id'],
                'sold' => $sold,
                'in_stock' => $inStock,
            ];

            if ($id) {
                $data['id'] = $id; 
                $this->ledgerContract->createOrUpdateLedger($ledgerData);
            } else {
                $this->ledgerContract->createOrUpdateLedger($ledgerData);
            }

            DB::commit();

            return response()->json([
                'success' => 'success',
                'message' => 'Inventory saved successfully!'
            ]);

        } catch (Exception $e) {

            DB::rollback();

            Log::error('Error during updateOrCreateInventory: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'error',
                'message' => 'An error occurred during updateOrCreateInventory.'
            ]);

            return redirect()->back();
        }
    }

    public function updateInventory(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();
        
        try {

            $data = $request->validate([
                'medicine_id' => 'nullable|exists:medicines,id',
                'sold' => 'nullable|integer|min:0',
            ]);
            $data['encode_by_id'] = $user->id; 
            $data['usage'] = $request->description;
            $data['quantity'] = $request->in_stock;

            $ledgerData = [
                'medicine_id' => $data['medicine_id'],
                'sold' => $request->sold,
                'in_stock' => $request->in_stock,
            ];

            if ($id) {
                $data['id'] = $id; 
                $this->ledgerContract->createOrUpdateLedger($ledgerData);
            } else {
                $this->ledgerContract->createOrUpdateLedger($ledgerData);
            }

            DB::commit();

            return response()->json([
                'success' => 'success',
                'message' => 'Inventory saved successfully!'
            ]);

        } catch (Exception $e) {

            DB::rollback();

            Log::error('Error during updateOrCreateInventory: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'error',
                'message' => 'An error occurred during updateOrCreateInventory.'
            ]);

            return redirect()->back();
        }
    }

    public function updateOrCreateMedication(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            
            DB::beginTransaction();
            $data = $request->validate([  
                'medicines' => 'required|array|min:1',
                'reason' => 'nullable|string|max:255',
            ]);   
            $data['patient_id'] = $user->id; 
            $data['medication_status'] = "Pending"; 
             
            foreach ($request->medicines as $medicine) {

                $data['medicine_id'] = $medicine['medicine_id'];
                $data['quantity'] = $medicine['quantity'];

                $this->medicationContract->createOrUpdateMedication($data);

                // $this->ledgerContract->updateLedgerQuantity($data['medicine_id'], $data['quantity']);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Request successfully added.',
            ]);

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateMedication: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return response()->json([
                'error' => true,
                'message' => 'Error please try again.',
            ]);
        }
    }
}
