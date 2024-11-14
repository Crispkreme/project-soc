<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
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

    public function createUser()
    {
        return Inertia::render('Auth/Register');
    }

    public function storeUser(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:' . User::class],
            'role' => ['string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $this->userContract->createOrUpdateUser($data);

        event(new Registered($user));

        Auth::login($user);
  
        $viewPath = match ($user->role) {
            'Administration' => 'admin.dashboard',
            'Patient' => 'patient.dashboard',
            'Practitioner' => 'practitioner.dashboard',
            'Bhw' => 'bhw.dashboard',
            default => 'login',
        };

        return redirect()->route($viewPath);
    }
    
    public function getAllCommunity()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.communities' => 'Practitioner',
            'patient.show.communities' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Communities/Community',
            'Patient' => 'Patients/Communities/Community',
            default => 'login'
        };

        return Inertia::render($viewPath);
    }

    public function getAllPractitionerCommunity()
    { 
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.communities.practitioner' => 'Practitioner',
            'patient.show.communities.practitioner' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Communities/Practitioner',
            'Patient' => 'Patients/Communities/Practitioner',
            default => 'login'
        };

        $totalBhw = $this->userDetailContract->countSpecificUserDetail('Bhw', 'Active');
        $totalPatient = $this->userDetailContract->countSpecificUserDetail('Patient', 'Active');
        $totalPractitioner = $this->userDetailContract->countSpecificUserDetail('Practitioner', 'Active');
        $practitioners = $this->userDetailContract->getAllUserByRole('Practitioner', 'Active');
        
        return Inertia::render($viewPath, [
            'totalBhw' => $totalBhw,
            'totalPatient' => $totalPatient,
            'totalPractitioner' => $totalPractitioner,
            'practitioners' => $practitioners,
        ]);
    }

    public function getAllBhwCommunity()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.communities.bhw' => 'Practitioner',
            'patient.show.communities.bhw' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Communities/Bhw',
            'Patient' => 'Patients/Communities/Bhw',
            default => 'login'
        };

        $totalBhw = $this->userDetailContract->countSpecificUserDetail('Bhw', 'Active');
        $totalPatient = $this->userDetailContract->countSpecificUserDetail('Patient', 'Active');
        $totalPractitioner = $this->userDetailContract->countSpecificUserDetail('Practitioner', 'Active');
        $bhws = $this->userDetailContract->getAllUserByRole('Bhw', 'Active');
        
        return Inertia::render($viewPath, [
            'totalBhw' => $totalBhw,
            'totalPatient' => $totalPatient,
            'totalPractitioner' => $totalPractitioner,
            'bhws' => $bhws,
        ]);
    }
}
