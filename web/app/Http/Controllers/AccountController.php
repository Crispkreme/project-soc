<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
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

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'admin.accounts.admin' => 'Administration',
            'admin.accounts.doctor' => 'Practitioner',
            'admin.accounts.bhw' => 'Bhw',
            'admin.accounts.patient' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $accounts = $this->userDetailContract->getAllUserByRole($accountType, true);

        $viewPath = match ($accountType) {
            'Administration' => 'Admins/Accounts/Admin',
            'Practitioner' => 'Admins/Accounts/Doctor',
            'Bhw' => 'Admins/Accounts/Bhw',
            'Patient' => 'Admins/Accounts/Patient',
            default => 'login'
        };

        return Inertia::render($viewPath, [
            'accounts' => $accounts,
        ]);
    }

}
