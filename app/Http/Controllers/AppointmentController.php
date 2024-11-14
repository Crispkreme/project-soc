<?php

namespace App\Http\Controllers;

use App\Contracts\BarangayEventContract;
use App\Contracts\UserDetailContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    protected $barangayEventContract;
    protected $userDetailContract;

    public function __construct(
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
    ) {
        $this->userDetailContract = $userDetailContract;
        $this->barangayEventContract = $barangayEventContract;
    }

    public function bookAppointment()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.book.appointments' => 'Practitioner',
            'patient.book.appointments' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Appointments/Appointment',
            'Patient' => 'Patients/Appointments/Appointment',
            default => 'login'
        };

        $barangayEvents = $this->barangayEventContract->getLatestBarangayEvent();
        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', 'Active');
        
        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
            'doctors' => $doctors,
        ]);
    }
}
