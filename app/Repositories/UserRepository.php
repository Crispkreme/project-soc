<?php

namespace App\Repositories;

use App\Models\User;
use App\Contracts\UserContract;

class UserRepository implements UserContract
{

    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateUser($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'],
                'username' => $data['username'],
            ]
        );
    }

    public function getUserById($id)
    {
        return $this->model
            ->where('id', $id)
            ->first();
    }
}
