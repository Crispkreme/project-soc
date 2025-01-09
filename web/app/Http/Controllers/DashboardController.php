<?php

namespace App\Http\Controllers;

use App\Contracts\BookingContract;
use App\Contracts\DataAnalyticContract;
use App\Contracts\LogContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $logContract;
    protected $bookingContract;
    protected $dataAnalyticContract;

    public function __construct(
        LogContract $logContract,
        BookingContract $bookingContract,
        DataAnalyticContract $dataAnalyticContract,
    ) {
        $this->dataAnalyticContract = $dataAnalyticContract;
        $this->logContract = $logContract;
        $this->bookingContract = $bookingContract;
    }

    public function dashboard()
    {
        $user = Auth::user();
        $message = session('message');
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        if($user->role === 'Administration') {
            return Inertia::render('Admins/Dashboard', [
                'message' => $message,
                'appointments' => $this->bookingContract->getCurrentBooking(),
                'dataAnalytic' => $this->dataAnalyticContract->getAllDataAnalyticByMonth(),
            ]);
        } else if($user->role === 'Practitioner') {
            return Inertia::render('Practitioners/Dashboard', [
                'message' => $message,
                'appointments' => $this->bookingContract->getCurrentBooking(),
                'dataAnalytic' => $this->dataAnalyticContract->getAllDataAnalyticByMonth(),
            ]);
        } else if($user->role === 'Bhw') {
            return Inertia::render('Bhws/Dashboard', [
                'message' => $message,
                'appointments' => $this->bookingContract->getCurrentBooking(),
                'dataAnalytic' => $this->dataAnalyticContract->getAllDataAnalyticByMonth(),
            ]);
        } else {
            return Inertia::render('Patients/Dashboard', [
                'message' => $message,
                'appointments' => $this->bookingContract->getPatientBooking($user->id),
                'dataAnalytic' => $this->dataAnalyticContract->getAllDataAnalyticByMonth(),
            ]);
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

    // for mobile
    public function getTopMedicineMobile()
    {
        $dataAnalytic = $this->dataAnalyticContract->getAllDataAnalyticByMonth();

        if ($dataAnalytic->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
        }

        return response()->json(['dataAnalytic' => $dataAnalytic]);
    }
}
