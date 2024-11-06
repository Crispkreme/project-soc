<?php

namespace App\Contracts;

interface UserDetailContract {

    public function createOrUpdateUserDetail($data);
    public function getUserDetailById($id);
    public function getAllUserDetails();
    public function getAllUserByRole($role, $status);
}
