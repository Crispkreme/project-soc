<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserDetailController extends Controller
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

    public function viewProfile($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'admin.view.profile' => 'Administration',
            'bhw.view.profile' => 'Bhw',
            'practitioner.view.profile' => 'Practitioner',
            'patient.view.profile' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $this->userDetailContract->getAllUserByRole($accountType, true);

        $viewPath = match ($accountType) {
            'Administration' => 'Admins/Profiles/UpdateProfile',
            'Bhw' => 'Bhws/Profiles/UpdateProfile',
            'Practitioner' => 'Practitioners/Profiles/UpdateProfile',
            'Patient' => 'Patients/Profiles/UpdateProfile',
            default => 'login'
        };

        $userDetail = $this->userDetailContract->getUserDetailById($id);

        return Inertia::render($viewPath, [
            'userDetail' => $userDetail,
        ]);
    }

    public function updateProfile(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            DB::beginTransaction();

            $data = $request->validate([
                'firstname' => 'required|string',
                'middlename' => 'nullable|string',
                'lastname' => 'required|string',
                'gender' => 'nullable|string|in:Male,Female',
                'birthday' => 'nullable|date',
                'civil_status' => 'nullable|string|in:Single,Married,Divorce,Separated',
                'religion' => 'required|string',
                'address' => 'nullable|string',
                'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
            
            $data['user_id'] = $user->id;

            if ($request->hasFile('profile')) {
                $image = $request->file('profile');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('public/profiles', $imageName);
                $data['profile'] = $imagePath;
            }

            dd($data);

            if ($id) {
                $data['id'] = $id;
                $this->userDetailContract->createOrUpdateUserDetail($data);
            } else {
                $this->userDetailContract->createOrUpdateUserDetail($data);
            }

            DB::commit();
            
            Session::flash('success', 'Account updated successfully!');

        } catch (Exception $e) {
            Log::error('Error during updateProfile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            Session::flash('error', 'An error occurred during updateProfile.');
            return redirect()->back();
        }
    }


    public function viewPassword($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $user = $this->userContract->getUserById($id);

        return Inertia::render('Patients/Profiles/Password', [
            'user' => $user,
        ]);
    }

    public function storeProfileDetail(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            DB::beginTransaction();

            $userDetailData = $request->validate([
                'user_id' => 'nullable|exists:users,id|unique:user_details,user_id',
                'firstname' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'lastname' => 'required|string|max:255',
                'gender' => 'nullable|in:Male,Female',
                'birthday' => 'nullable|date',
                'civil_status' => 'nullable|in:Single,Married,Divorce,Separated',
                'religion' => 'required|string|max:255',
                'address' => 'nullable|string|max:1000',
                'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
            $userDetailData['status'] = 'Active'; 

            $fullName = $userDetailData['firstname'] . ' ' . ($userDetailData['middlename'] ?? '') . ' ' . $userDetailData['lastname'];
            $slug = Str::slug($fullName);
            
            $username = strtolower(Str::slug($userDetailData['firstname'] . $userDetailData['lastname'] . rand(100, 999)));
            $email = strtolower(Str::slug($userDetailData['firstname'] . '.' . $userDetailData['lastname'] . rand(100, 999))) . '@example.com';

            $userDetailData['slug'] = $slug;
            $userData['email'] = $email;
            $userData['username'] = $username;
            $userData['password'] = 'password';
            $userData['role'] = $request->isPage;

            $user = $this->userContract->createOrUpdateUser($userData);

            $userDetailData['user_id'] = $user->id;

            $this->userDetailContract->createOrUpdateUserDetail($userDetailData);

            DB::commit();

            return redirect()->back()->with('success', 'Account added successfully!');

        } catch (Exception $e) {

            Log::error('Error during storeProfileDetail: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            Session::flash('error', '');

            return redirect()->back()->with('success', 'An error occurred during account creation.');
        }
    }

    public function activateAccount(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            DB::beginTransaction();

            $this->userDetailContract->updateUserDetailStatus('Active', $request->id);

            DB::commit();

            return redirect()->back()->with('success', 'Account activated successfully!');

        } catch (Exception $e) {

            Log::error('Error during activateAccount: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Error please try again.');
        }
    }

    public function deactivateAccount(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            DB::beginTransaction();

            $this->userDetailContract->updateUserDetailStatus('Deactivate', $request->id);

            DB::commit();

            return redirect()->back()->with('success', 'Account deactivated successfully!');

        } catch (Exception $e) {

            Log::error('Error during deactivateAccount: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Error please try again.');
        }
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'profile' => 'required|image|max:2048',
        ]);

        $path = $request->file('profile')->store('profiles', 'public');

        $this->userDetailContract->createOrUpdateUserAvatar($path);

        return response()->json([
            'profile' => asset('storage/' . $path),
        ]);
    }


    public function getAllUsers()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $users = $this->userDetailContract->getAllUserDetails();
        return response()->json(['users' => $users ]);
    }

    // for mobile
    public function getAllDoctorMobile()
    {
        $doctor = $this->userDetailContract->getAllUserByRole('Practitioner', true);
        return response()->json(['doctor' => $doctor ]);
    }
}
