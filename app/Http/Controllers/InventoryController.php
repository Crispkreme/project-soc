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

    public function updateOrCreateInventory(Request $request, $id = null)
    {

        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        DB::beginTransaction();

        $data = $request->validate([
            'medicine_id' => 'nullable|exists:medicines,id',
            'encode_by_id' => 'nullable|exists:users,id',
            'usage' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
        
            if ($id) {
                $data['id'] = $id; 
                $this->inventoryContract->createOrUpdateInventory($data);
            } else {
                $this->inventoryContract->createOrUpdateInventory($data);
            }
        
            $ledgers = $this->ledgerContract->getLedgerByMedicineId($data['medicine_id']);
            
            $inStock = ($data['quantity'] ?? 0) + ($ledgers->in_stock ?? 0);
            $sold = $ledgers->sold ?? 0;
        
            $ledgerData = [
                'medicine_id' => $data['medicine_id'],
                'sold' => $sold,
                'in_stock' => $inStock,
            ];
            
            // DB::enableQueryLog();
            $this->ledgerContract->createOrUpdateLedger($ledgerData);
            // dd(DB::getQueryLog());

            DB::commit();
            
            Session::flash('success', 'Inventory saved successfully!');
        
        } catch (Exception $e) {

            dd($e);

            Log::error('Error during updateOrCreateInventory: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
        
            DB::rollback();
        
            Session::flash('error', 'An error occurred during updateOrCreateInventory.');
            return redirect()->back();
        }        
        
    }
}
