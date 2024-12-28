<?php

namespace App\Contracts;

interface UserContract {

    public function createOrUpdateUser($data);
    public function getUserById($id);
    public function changeEmail($data);
    public function changePassword($data);
}
