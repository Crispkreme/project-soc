<?php

namespace App\Http\Controllers;

use App\Contracts\LogContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $logContract;

    public function __construct(
        LogContract $logContract,
    ) {
        $this->logContract = $logContract;
    }

    public function dashboard()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        if($user->role === 'Administration') {
            return Inertia::render('Admins/Dashboard');
        } else if($user->role === 'Practitioner') {
            return Inertia::render('Practitioners/Dashboard');
        } else if($user->role === 'Bhw') {
            return Inertia::render('Bhws/Dashboard');
        } else {
            return Inertia::render('Patients/Dashboard');
        }
    }

    public function getUserLogs()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            // 'admin.accounts.admin' => 'Administration',
            // 'admin.accounts.doctor' => 'Practitioner',
            // 'admin.accounts.bhw' => 'Bhw',
            'patient.logs' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $logs = $this->logContract->getAllPatientLog($user->id);

        $viewPath = match ($accountType) {
            // 'Administration' => 'Admins/Accounts/Admin',
            // 'Practitioner' => 'Admins/Accounts/Doctor',
            // 'Bhw' => 'Admins/Accounts/Bhw',
            'Patient' => 'Patients/Logs/Log',
            default => 'login'
        };
        return Inertia::render($viewPath, [
            'logs' => $logs,
        ]);
    }
}
