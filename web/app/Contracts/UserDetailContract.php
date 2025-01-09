<?php

namespace App\Contracts;

interface UserDetailContract {

    public function createOrUpdateUserDetail($data);
    public function getUserDetailById($id);
    public function getAllUserDetails();
    public function getAllUserByRole($role, $status);
    public function getAllUserNameByRole($role, $status);
    public function getSpecificUserDetailsById($id, $role, $status);
    public function countSpecificUserDetail($role, $status);
    public function updateUserDetailStatus($status, $id);
    public function createOrUpdateUserAvatar($data);
    public function getFullname($id);
    public function getPatientData($id);
}
