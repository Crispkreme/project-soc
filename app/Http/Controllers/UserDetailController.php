<?php

namespace App\Http\Controllers;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        $userDetail = $this->userDetailContract->getUserDetailById($id);

        return Inertia::render('Patients/Profiles/Profile', [
            'userDetail' => $userDetail,
        ]);
    }

    public function updateProfile(Request $request, $id = null)
    {
        
        DB::beginTransaction();

        $data = $request->validate([
            'user_id' => 'required|integer',
            'firstname' => 'required|string',
            'middlename' => 'nullable|string',
            'lastname' => 'required|string',
            'gender' => 'nullable|string|in:Male,Female',
            'birthday' => 'nullable|date',
            'civil_status' => 'nullable|string|in:Single,Married,Divorce,Separated',
            'religion' => 'required|string',
            'profile' => 'nullable|string',
        ]);
        $data['profile'] = null;

        try {
            
            if ($id) {
                $data['id'] = $id; 
                $this->userDetailContract->createOrUpdateUserDetail($data);
            } else {
                $this->userDetailContract->createOrUpdateUserDetail($data);
            }

            DB::commit();
            
            Session::flash('success', 'Pet saved successfully!');

        } catch (Exception $e) {

            Log::error('Error during petStore: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            Session::flash('error', 'An error occurred during registration.');
            return redirect()->back();
        }
    }

    public function viewPassword($id)
    {
        $user = $this->userContract->getUserById($id);

        return Inertia::render('Patients/Profiles/Password', [
            'user' => $user,
        ]);
    }
}
