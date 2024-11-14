<?php

namespace App\Repositories;

use App\Contracts\UserContract;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
                'email' => $data['email'] ?? null,
                'password' => Hash::make($data['password']),
                'role' => $data['role'] ?? 'Patient',
                'username' => $data['username'] ?? null,
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
