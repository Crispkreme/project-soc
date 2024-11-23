<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravolt\Avatar\Facade as Avatar;

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

    public function getUserAvatar($username)
    {
        $avatar = Avatar::create($username)->toBase64();
        return response()->json(['avatar' => $avatar]);
    }

    public function getUserDetail($id)
    {
        $userDetail = $this->userDetailContract->getUserDetailById($id);
        return response()->json(['userDetail' => $userDetail]);
    }

    public function storeUser(Request $request)
    {
        
        DB::beginTransaction();

        try {
            $data = $request->validate([
                'username' => ['required', 'string', 'max:255', 'unique:' . User::class],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);
            $data['role'] = 'Patient';
            $user = $this->userContract->createOrUpdateUser($data);

            $userDetailData = [
                'user_id' => $user->id,
                'firstname' => '',
                'middlename' => null,
                'lastname' => '',
                'gender' => null,
                'birthday' => null,
                'civil_status' => null,
                'religion' => '',
                'status' => 'Active',
                'address' => null,
                'profile' => null,
            ];

            $this->userDetailContract->createOrUpdateUserDetail($userDetailData);

            event(new Registered($user));

            Auth::login($user);

            $viewPath = match ($user->role) {
                'Administration' => 'admin.dashboard',
                'Patient' => 'patient.dashboard',
                'Practitioner' => 'practitioner.dashboard',
                'Bhw' => 'bhw.dashboard',
                default => 'login',
            };

            DB::commit();

            return response()->json([
                'success' => 'success',
                'message' => 'User saved successfully!'
            ]);

            return redirect()->route($viewPath);

        } catch (Exception $e) {
            
            Log::error('Error during storeUser: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            Session::flash('error', 'An error occurred during user registration.');

            return response()->json([
                'error' => 'error',
                'message' => 'Please try again'
            ]);
        }
    }

    public function updatePassword(Request $request, $id = null)
    {
        $data = $request->validate([
            'current_password' => ['required', Password::defaults()],
            'new_password' => ['required', 'confirmed', Password::defaults()],
            'new_password_confirmation' => ['required', Password::defaults()],
        ]);
        
        $user = $this->userContract->getUserById($id);

        if(trim($data['new_password']) == trim($data['new_password_confirmation']))
        {
            if(Hash::check($data['current_password'], $user->password))
            {
                $data['password'] = $data['new_password'];
                $data['email'] = $user->email;
                $data['username'] = $user->username;
                $this->userContract->createOrUpdateUser($data);
                return redirect()->back();
            }
        }
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
        $bhws = $this->userDetailContract->getAllUserByRole('Bhw', 'Active');
        
        return Inertia::render($viewPath, [
            'totalBhw' => $totalBhw,
            'totalPatient' => $totalPatient,
            'totalPractitioner' => $totalPractitioner,
            'practitioners' => $practitioners,
            'bhws' => $bhws,
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
        $practitioners = $this->userDetailContract->getAllUserByRole('Practitioner', 'Active');
        $bhws = $this->userDetailContract->getAllUserByRole('Bhw', 'Active');
        
        return Inertia::render($viewPath, [
            'totalBhw' => $totalBhw,
            'totalPatient' => $totalPatient,
            'totalPractitioner' => $totalPractitioner,
            'practitioners' => $practitioners,
            'bhws' => $bhws,
        ]);
    }

    public function getAllPatientCommunity()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.communities.patient' => 'Practitioner',
            'patient.show.communities.patient' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Communities/Patient',
            'Patient' => 'Patients/Communities/Patient',
            default => 'login'
        };

        $totalBhw = $this->userDetailContract->countSpecificUserDetail('Bhw', 'Active');
        $totalPatient = $this->userDetailContract->countSpecificUserDetail('Patient', 'Active');
        $totalPractitioner = $this->userDetailContract->countSpecificUserDetail('Practitioner', 'Active');
        $patients = $this->userDetailContract->getAllUserByRole('Patient', 'Active');
        
        return Inertia::render($viewPath, [
            'totalBhw' => $totalBhw,
            'totalPatient' => $totalPatient,
            'totalPractitioner' => $totalPractitioner,
            'patients' => $patients,
        ]);
    }

    public function loginDestroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
