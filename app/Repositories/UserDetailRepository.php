<?php

namespace App\Repositories;

use App\Contracts\UserDetailContract;
use App\Models\UserDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
                'user_id' => $data['user_id'] ?? null,
            ],
            [
                
                'firstname' => $data['firstname'] ?? '',
                'middlename' => $data['middlename'] ?? null,
                'lastname' => $data['lastname'] ?? '',
                'gender' => $data['gender'] ?? null,
                'birthday' => $data['birthday'] ?? null,
                'civil_status' => $data['civil_status'] ?? null,
                'religion' => $data['religion'] ?? '',
                'status' => $data['status'] ?? 'Active',
                'address' => $data['address'] ?? null,
                'profile' => $data['profile'] ?? null,
            ]
        );
    }

    public function getUserDetailById($id)
    {
        return $this->model
            ->where('user_id', $id)
            ->first();
    }

    public function getAllUserDetails()
    {
        return $this->model
            ->join('users', 'user_details.user_id', '=', 'users.id')
            ->select(
                'user_details.*',
                'users.role'
            )
            ->get();
    }

    public function getAllUserByRole($role, $status)
    {
        return $this->model
            ->join('users', 'user_details.user_id', '=', 'users.id')
            ->select(
                'user_details.*',
                'users.role'
            )
            ->where('users.role', '=', $role)
            ->get()
            ->map(function ($user) {
                return [
                    'name' => "{$user->firstname} {$user->middlename} {$user->lastname}",
                    'gender' => $user->gender,
                    'birthday' => Carbon::parse($user->birthday)->format('F d, Y'),
                    'age' => Carbon::parse($user->birthday)->age,
                    'role' => $user->role,
                    'status' => $user->status,
                ];
            });
    }

    public function getSpecificUserDetailsById($id, $role, $status)
    {
        return $this->model
            ->join('users', 'user_details.user_id', '=', 'users.id')
            ->select(
                'user_details.*',
                'users.role'
            )
            ->where('user_details.id', '=', $id)
            ->where('users.role', '=', $role)
            ->where('user_details.status', '=', 'Active')
            ->get();
    }

    public function countSpecificUserDetail($role, $status)
    {
        return $this->model
            ->join('users', 'user_details.user_id', '=', 'users.id')
            ->select(
                'user_details.*',
                'users.role'
            )
            ->where('users.role', '=', $role)
            ->where('user_details.status', '=', $status)
            ->count();
    }

    public function updateUserDetailStatus($status, $id)
    {
        $user = $this->model->findOrFail($id);
        $user->update(['status' => $status]);
    }

    public function createOrUpdateUserAvatar($path)
    {
        $user = Auth::user();
        $userDetail = $this->model->where('user_id', $user->id)->firstOrFail();

        if ($userDetail->profile) {
            Storage::disk('public')->delete($userDetail->profile);
        }

        $userDetail->update(['profile' => $path]);
    }

    public function getAllUserNameByRole($role, $status)
    {
        return $this->model
        ->join('users', 'user_details.user_id', '=', 'users.id')
        ->select(
            'user_details.id',
            DB::raw("CONCAT(user_details.firstname, ' ', user_details.middlename, ' ', user_details.lastname) as name")
        )
        ->where('users.role', '=', $role)
        ->where('status', '=', $status)
        ->get();
    }
}
