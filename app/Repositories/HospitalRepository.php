<?php

namespace App\Repositories;

use App\Models\Hospital;
use App\Contracts\HospitalContract;

class HospitalRepository implements HospitalContract
{

    protected $model;

    public function __construct(Hospital $model)
    {
        $this->model = $model;
    }

    public function getAllHospital()
    {
        return $this->model->get();
    }
}
