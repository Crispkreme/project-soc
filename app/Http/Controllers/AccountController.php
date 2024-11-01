<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    protected $userDetailContract;
    protected $userContract;

    public function __construct(
        UserDetailContract $userDetailContract,
        UserContract $userContract,
    ) {
        $this->userDetailContract = $userDetailContract;
        $this->userContract = $userContract;
    }
    
    public function getAccount()
    {
        $userDetails = $this->userDetailContract->getAllUserDetails();

        return Inertia::render('Admins/Accounts/Account', [
            'userDetails' => $userDetails,
        ]);
    }
}
