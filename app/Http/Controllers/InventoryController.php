<?php

namespace App\Http\Controllers;

use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
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

    public function __construct(
        InventoryContract $inventoryContract,
        LedgerContract $ledgerContract,
        MedicineContract $medicineContract,
    ) {
        $this->inventoryContract = $inventoryContract;
        $this->ledgerContract = $ledgerContract;
        $this->medicineContract = $medicineContract;
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
}
