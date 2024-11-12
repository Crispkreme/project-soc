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
            // 'admin.accounts.doctor' => 'Practitioner',
            // 'admin.accounts.bhw' => 'Bhw',
            // 'admin.accounts.patient' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $this->userDetailContract->getAllUserByRole($accountType, true);

        $viewPath = match ($accountType) {
            'Administration' => 'Admins/Profiles/UpdateProfile',
            // 'Practitioner' => 'Admins/Accounts/Doctor',
            // 'Bhw' => 'Admins/Accounts/Bhw',
            // 'Patient' => 'Admins/Accounts/Patient',
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
            ]);
            $data['user_id'] = $user->id; 

            if ($id) {
                $data['id'] = $id; 
                $this->userDetailContract->createOrUpdateUserDetail($data);
            } else {
                $this->userDetailContract->createOrUpdateUserDetail($data);
            }

            DB::commit();
            
            Session::flash('success', 'Account updated successfully!');

        } catch (Exception $e) {
            dd($e);
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
}
