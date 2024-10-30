<?php

namespace App\Repositories;

use App\Models\UserDetail;
use App\Contracts\UserDetailContract;

class UserDetailRepository implements UserDetailContract
{

    protected $model;

    public function __construct(UserDetail $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateUserDetail($data)
    {   
        return $this->model->updateOrCreate(
            [
                'user_id' => $data['user_id'],
            ],
            [
                
                'firstname' => $data['firstname'],
                'middlename' => $data['middlename'],
                'lastname' => $data['lastname'],
                'gender' => $data['gender'],
                'birthday' => $data['birthday'],
                'civil_status' => $data['civil_status'],
                'religion' => $data['religion'],
                'profile' => $data['profile'],
            ]
        );
    }

    public function getUserDetailById($id)
    {
        return $this->model
            ->where('user_id', $id)
            ->first();
    }
}
