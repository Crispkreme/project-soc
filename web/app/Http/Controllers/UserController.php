<?php

namespace App\Http\Controllers;

use App\Contracts\MessageContract;
use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use App\Models\Message;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;
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
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravolt\Avatar\Facade as Avatar;

class UserController extends Controller
{
    protected $userDetailContract;
    protected $userContract;
    protected $messageContract;

    public function __construct(
        UserDetailContract $userDetailContract,
        UserContract $userContract,
        MessageContract $messageContract,
    ) {
        $this->userDetailContract = $userDetailContract;
        $this->userContract = $userContract;
        $this->messageContract = $messageContract;
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

        if ($request->address && Str::contains(strtolower($request->address), 'lapay')) {
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
                    'firstname' => $request->firstname,
                    'middlename' => $request->middlename,
                    'lastname' => $request->lastname,
                    'gender' => $request->gender,
                    'birthday' => $request->birthday,
                    'civil_status' => $request->civil_status,
                    'religion' => $request->religion,
                    'status' => 'Active',
                    'address' => $request->firstname,
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
                
                Session::flash('success', 'User saved successfully!');
                
                return redirect()->route($viewPath)->with('success', '');
    
            } catch (Exception $e) {
                
                Log::error('Error during storeUser: ' . $e->getMessage(), [
                    'exception' => $e,
                    'trace' => $e->getTraceAsString(),
                ]);
    
                DB::rollback();
                
                Session::flash('error', 'Error please try again.');

                return redirect()->back();
            }

        } else {
            // return back()->withErrors(['message' => 'Residence only.']);
            dd('You are not eligible to proceed due to certian restrictions of address');
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

    public function changeEmail(Request $request)
    {
        $data = $request->validate([  
            'current_email' => 'required|email|exists:users,email',
            'new_email' => 'required|email|unique:users,email',
        ]);

        $user = Auth::user();

        if ($user->email !== $request->current_email) {
            return redirect()->back()->with('error', 'The current email does not match our records.');
        }

        $this->userContract->changeEmail($data['new_email']);

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('login')->with('success', 'Your email has been updated successfully. Please log in with your new email.');        
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:3|confirmed',
        ]);

        $this->userContract->changePassword($data['new_password']);

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()
            ->route('login')
            ->with('success', 'Your password has been updated successfully. Please log in with your new password.');        
    }

    public function deactivateAccount(Request $request)
    {
        $userId = Auth::user()->id;
        $status = 'Deactivate';
        $this->userDetailContract->updateUserDetailStatus($status, $userId);

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('login')->with('success', 'Your account has been deactivated successfully.');        
    }

    // for mobile
    public function loginMobile(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'device_name' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();
        $userDetail = UserDetail::where('user_id', $user->id)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role !== 'Patient') {
            throw ValidationException::withMessages([
                'email' => ['You must be a patient to log in.'],
            ]);
        }

        if ($userDetail->status !== 'Active') {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken($request->device_name)->plainTextToken,
        ]);
    }

    public function createUserMobile(Request $request)
    {
        try {
            $data = $request->validate([
                'username' => 'required|string|lowercase|max:255|unique:' . User::class,
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Password::defaults()],
                'firstname' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'lastname' => 'required|string|max:255',
                'gender' => 'nullable|in:Male,Female',
                'birthday' => 'nullable|date|before:today',
                'civil_status' => 'nullable|in:Single,Married,Divorce,Separated',
                'religion' => 'required|string|max:255',
                'status' => 'nullable|in:Active,Deactivate',
                'address' => 'nullable|string|max:65535',
            ]);

            $userData = [
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'Patient',
            ];

            $user = $this->userContract->createOrUpdateUser($userData);

            $userDetailData = [
                'user_id' => $user->id,
                'firstname' => $data['firstname'],
                'middlename' => $data['middlename'] ?? null,
                'lastname' => $data['lastname'],
                'gender' => $data['gender'],
                'birthday' => $data['birthday'],
                'civil_status' => $data['civil_status'],
                'religion' => $data['religion'],
                'address' => $data['address'] ?? null,
                'profile' => null,
            ];

            $this->userDetailContract->createOrUpdateUserDetail($userDetailData);

            return response()->json(['message' => 'Successfully created an account']);
            
        } catch (Exception $e) {
            Log::error('Error during createUserMobile', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'An error occurred, please try again.');
        }
    }

    public function getUserDetailsMobile($id)
    {
        try {
            
            $details = $this->userDetailContract->getUserDetailById($id);

            return response()->json([
                'details' => $details,
            ]);

        } catch (Exception $e) {
                
            Log::error('Error during getUserDetailsMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            
            Session::flash('error', 'Error please try again.');

            return redirect()->back();
        }
    }

    public function updateUserMobile(Request $request)
    {
        try {
            $data = $request->validate([
                'firstname' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'lastname' => 'required|string|max:255',
                'gender' => 'nullable|in:Male,Female',
                'birthday' => 'nullable|date|before:today',
                'civil_status' => 'nullable|in:Single,Married,Divorce,Separated',
                'religion' => 'required|string|max:255',
                'status' => 'nullable|in:Active,Deactivate',
                'address' => 'nullable|string|max:65535',
            ]);
            $data['user_id'] = $request->user_id;

            $details = $this->userDetailContract->createOrUpdateUserDetail($data);

            return response()->json([
                'details' => $details,
            ]);

        } catch (Exception $e) {
                
            Log::error('Error during updateUserMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();
            
            Session::flash('error', 'Error please try again.');

            return redirect()->back();
        }
    }

    public function updateUserEmailMobile(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            ]);
            $data['user_id'] = $request->user_id;


            if (!$data['user_id']) {
                return response()->json([
                    'error' => 'User not authenticated'
                ], 401);
            }

            $user = DB::select('SELECT * FROM users WHERE id = ? LIMIT 1', [$data['user_id']]);

            if (!$user) {
                return response()->json([
                    'error' => 'User not authenticated'
                ], 401);
            }

            $updated = DB::update('UPDATE users SET email = ? WHERE id = ?', [$data['email'], $data['user_id']]);

            if ($updated) {
                return response()->json([
                    'user' => $user[0],
                    'message' => 'Email updated successfully'
                ], 200);
            } else {
                return response()->json([
                    'error' => 'Failed to update email, please try again.'
                ], 500);
            }

        } catch (Exception $e) {
            Log::error('Error during updateUserEmailMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Error updating email, please try again.'
            ], 500);
        }
    }

    public function updateUserPasswordMobile(Request $request)
    {
        try {
            $data = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            $data['user_id'] = $request->user_id;

            if (!$data['user_id']) {
                return response()->json([
                    'error' => 'User not authenticated'
                ], 401);
            }

            // Retrieve the user from the database
            $user = DB::select('SELECT * FROM users WHERE id = ? LIMIT 1', [$data['user_id']]);

            if (!$user) {
                return response()->json([
                    'error' => 'User not found or not authenticated'
                ], 401);
            }

            // Check if the current password is correct
            if (!Hash::check($data['current_password'], $user[0]->password)) {
                return response()->json([
                    'error' => 'Current password is incorrect'
                ], 400);
            }

            // Hash the new password
            $hashedPassword = Hash::make($data['new_password']);

            // Update the user's password in the database
            $updated = DB::update('UPDATE users SET password = ? WHERE id = ?', [$hashedPassword, $data['user_id']]);

            // Return the appropriate response
            return response()->json([
                'user' => $user[0],
                'message' => 'Password updated successfully'
            ], 200);

        } catch (Exception $e) {
            Log::error('Error during updateUserPasswordMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Error updating password, please try again.'
            ], 500);
        }
    }

    public function deactivateUserMobile($id)
    {
        try {

            DB::update('UPDATE user_details SET status = ? WHERE user_id = ?', ['Deactivate', $id]);

            return response()->json([
                'message' => 'User deactivated successfully'
            ], 200);

        } catch (Exception $e) {
            Log::error('Error during updateUserEmailMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Error deactivating account, please try again.'
            ], 500);
        }
    }

    public function getAllMessageMobile(Request $request)
    {
        // try {
        //     $senderId = $request->sender_id;
        //     $receiverId = $request->receiver_id;

        //     $messages = Message::join('user_details as sender_details', 'messages.sender_id', '=', 'sender_details.user_id')
        //         ->join('user_details as receiver_details', 'messages.receiver_id', '=', 'receiver_details.user_id')
        //         ->select(
        //             'messages.*',
        //             'sender_details.firstname as sender_first_name',
        //             'sender_details.lastname as sender_last_name',
        //             'receiver_details.firstname as receiver_first_name',
        //             'receiver_details.lastname as receiver_last_name'
        //         )
        //         ->where(function ($query) use ($senderId, $receiverId) {
        //             $query->where('messages.sender_id', $senderId)
        //                 ->where('messages.receiver_id', $receiverId);
        //         })
        //         ->orWhere(function ($query) use ($senderId, $receiverId) {
        //             $query->where('messages.sender_id', $receiverId)
        //                 ->where('messages.receiver_id', $senderId);
        //         })
        //         ->orderBy('messages.created_at', 'asc')
        //         ->get()
        //         ->map(function ($message) {
        //             return [
        //                 'sender_id' => $message->sender_id,
        //                 'receiver_id' => $message->receiver_id,
        //                 'sender_name' => "{$message->sender_first_name} {$message->sender_last_name}",
        //                 'receiver_name' => "{$message->receiver_first_name} {$message->receiver_last_name}",
        //                 'message' => $message->message,
        //                 'date' => Carbon::parse($message->created_at)->format('F d, Y'),
        //             ];
        //         });

        //     return response()->json([
        //         'message' => $messages,
        //     ], 200);

        // } catch (Exception $e) {
        //     Log::error('Error during getAllMessageMobile: ' . $e->getMessage(), [
        //         'exception' => $e,
        //         'trace' => $e->getTraceAsString(),
        //     ]);

        //     return response()->json([
        //         'error' => 'Error deactivating account, please try again.'
        //     ], 500);
        // }

        return response()->json([
            'message' => 'sasdasdasdasd',
        ], 200);
    }

}
