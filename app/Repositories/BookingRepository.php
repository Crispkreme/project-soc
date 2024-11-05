<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Contracts\BookingContract;

class BookingRepository implements BookingContract
{

    protected $model;

    public function __construct(Booking $model)
    {
        $this->model = $model;
    }

    public function getAllBooking()
    {
        return $this->model->get();
    }
}
