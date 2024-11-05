<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $userDetails = $this->userDetailContract->getAllUserDetails();

        return Inertia::render('Admins/Accounts/Account', [
            'userDetails' => $userDetails,
        ]);
    }
}
