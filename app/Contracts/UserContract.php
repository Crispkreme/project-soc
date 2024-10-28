<?php

namespace App\Contracts;

interface UserContract {

    public function createOrUpdateUser($data);
    public function getUserById($id);
}
