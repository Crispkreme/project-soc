<?php

namespace App\Contracts;

interface ReferralContract {

    public function updateOrCreateReferral($data);
    public function getAllReferral();
}
