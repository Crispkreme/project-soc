<?php

namespace App\Repositories;

use App\Models\Notification;
use App\Contracts\NotificationContract;

class NotificationRepository implements NotificationContract
{

    protected $model;

    public function __construct(Notification $model)
    {
        $this->model = $model;
    }

    public function createOrUpdateNotification($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'user_id' => $data['user_id'],
                'message' => $data['message'],
            ]
        );
    }

    public function getNotificationByRole($role)
    {
        if (in_array($role, ['Administration', 'Bhw', 'Practitioner'])) {
            return $this->model
                ->whereHas('user', function ($query) {
                    $query->where('role', 'Patient');
                })
                ->get();
        } elseif ($role === 'Patient') {
            return $this->model
                ->whereHas('user', function ($query) {
                    $query->whereIn('role', ['Administration', 'Bhw', 'Practitioner']);
                })
                ->get();
        }

        return collect();
    }
}
