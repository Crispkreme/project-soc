<?php

namespace App\Http\Controllers;

use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
use App\Contracts\LogContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Pest\Support\NullClosure;

class InventoryController extends Controller
{
    protected $inventoryContract;
    protected $ledgerContract;
    protected $medicineContract;
    protected $medicationContract;
    protected $logContract;

    public function __construct(
        InventoryContract $inventoryContract,
        LedgerContract $ledgerContract,
        MedicineContract $medicineContract,
        MedicationContract $medicationContract,
        LogContract $logContract,
    ) {
        $this->inventoryContract = $inventoryContract;
        $this->ledgerContract = $ledgerContract;
        $this->medicineContract = $medicineContract;
        $this->medicationContract = $medicationContract;
        $this->logContract = $logContract;
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
                'expiration_date' => $request->expiration_date,
                'dosage' => $request->dosage,
            ];
            
            if ($id) {
                $data['id'] = $id; 
                $this->ledgerContract->createOrUpdateLedger($ledgerData);
            } else {
                $this->ledgerContract->createOrUpdateLedger($ledgerData);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Inventory saved successfully!');

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error during updateOrCreateInventory: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()->with('error', 'Error please try again.');
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

            return redirect()->back()->with('success', 'Inventory saved successfully!');

        } catch (Exception $e) {

            DB::rollback();

            Log::error('Error during updateOrCreateInventory: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Error please try again.');
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
                'pdf_file' => 'nullable|string',
            ]);   
            $data['pdf_file'] = null; 
            $data['patient_id'] = $user->id; 
            $data['medication_status'] = "Accept"; 
             
            foreach ($request->medicines as $medicine) {

                $data['medicine_id'] = $medicine['medicine_id'];
                $data['quantity'] = $medicine['quantity'];

                $this->medicationContract->createOrUpdateMedication($data);
                $this->ledgerContract->updateLedgerQuantity($data['medicine_id'], $data['quantity']);
            }
            
            DB::commit();
        
            return redirect()->back()->with('success', 'Medicination Request successfully added.');

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateMedication: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Error please try again.');
        }
    }

    public function approveMedication(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        DB::beginTransaction();
        
        try {
            
            $medicine = $this->medicationContract->getSpecificMedicationById($id);
            $medicineId = $medicine->medicine_id;
            $quantity = $medicine->quantity;

            $this->medicationContract->updateMedicationStatusById('Success', $id);
            if (!$medicine) {
                return redirect()->back()->with('error', 'Medication not found.');
            }

            $inventories = $this->inventoryContract->getAllInventoryQuantityById($medicineId);
            if (!$inventories) {
                return redirect()->back()->with('error', 'Inventory data not found.');
            }
            
            $ledgers = $this->ledgerContract->getLedgerByMedicineId($medicineId);
            if (!$ledgers) {
                return redirect()->back()->with('error', 'Ledger data not found.');
            }
            
            // if ($ledgers->in_stock < $inventories->quantity) {
            //     return redirect()->back()->with('error', 'Insufficient stock available.');
            //     dd('Insufficient stock available.');
            // }
            
            $inStock = $ledgers->in_stock - $inventories->quantity;

            if ($inStock === 0) {
                return redirect()->back()->with('error', 'Insufficient stock available.');
                dd('Insufficient stock available.');
            }

            $sold = $inventories->quantity;
            $ledgerData = [
                'medicine_id' => $medicineId,
                'sold' => $sold + $ledgers->sold,
                'in_stock' => $inStock,
            ];
            $ledgerData['id'] = $ledgers->id;
            $this->ledgerContract->createOrUpdateLedger($ledgerData);
            
            $inventoryData = [
                'medicine_id' => $inventories->medicine_id,
                'encode_by_id' => $inventories->encode_by_id,
                'usage' => $inventories->usage,
                'quantity' => $inStock,
            ];
            $inventoryData['id'] = $inventories->id;
            $dddddd = $this->inventoryContract->createOrUpdateInventory($inventoryData);
            $logData = [
                'doctor_id' => $user->id,
                'patient_id' => $medicine->patient_id, 
                'message' => 'has approved your medicine request',
                'log_status' => 'Success',
            ];

            $this->logContract->updateOrCreateLog($logData);

            DB::commit();

            return redirect()->back()->with('success', 'Medication approved and inventory updated successfully!');

        } catch (Exception $e) {
            DB::rollback();

            Log::error('Error during approveMedication: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'An error occurred during approveMedication.');

        }
    }

    public function getMedicineQuantity($id)
    {
        $medicines = $this->ledgerContract->checkLedgerQuantity($id);
        return response()->json(['medicines' => $medicines]);
    }
}
