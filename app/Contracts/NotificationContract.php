<?php

namespace App\Contracts;

interface NotificationContract {

    public function createOrUpdateNotification($data);
    public function getNotificationByRole($data);
}
