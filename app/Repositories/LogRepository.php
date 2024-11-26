<?php

namespace App\Repositories;

use App\Contracts\LogContract;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LogRepository implements LogContract
{

    protected $model;

    public function __construct(Log $model)
    {
        $this->model = $model;
    }

    public function updateOrCreateLog($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],[
                'user_id' => $data['user_id'],
                'message' => $data['message'],
                'log_status' => $data['log_status'],
            ]
        );
    }

    public function getAllLog()
    {
        return $this->model->get();
    }

    public function getLogById($id)
    {
        return $this->model->where('user_id', $id)->get();
    }
}
