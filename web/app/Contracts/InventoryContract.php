<?php

namespace App\Contracts;

interface InventoryContract {

    public function createOrUpdateInventory($data);
    public function getInventoryById($id);
    public function getAllInventory();
    public function getAllInventoryQuantityById($id);
}
