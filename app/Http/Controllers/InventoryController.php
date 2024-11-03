<?php

namespace App\Http\Controllers;

use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
use App\Contracts\MedicineContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function updateOrCreateInventory(Request $request)
    {
        dd($request);
    }
}
