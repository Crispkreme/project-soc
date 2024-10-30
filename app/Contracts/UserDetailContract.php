<?php

namespace App\Contracts;

interface UserDetailContract {

    public function createOrUpdateUserDetail($data);
    public function getUserDetailById($id);
}
