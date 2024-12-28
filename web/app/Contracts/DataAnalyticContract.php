<?php

namespace App\Contracts;

interface DataAnalyticContract {

    public function updateOrCreateDataAnalytic($data);
    public function getAllDataAnalyticByMonth();
}
