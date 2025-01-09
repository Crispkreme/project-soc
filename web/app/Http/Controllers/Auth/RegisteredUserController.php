<?php

namespace App\Http\Controllers\Auth;

use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    protected $userContract;
    protected $userDetailContract;

    public function __construct(
        UserContract $userContract,
        UserDetailContract $userDetailContract,
    ) {
        $this->userContract = $userContract;
        $this->userDetailContract = $userDetailContract;
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        $data = $request->validate([
            'username' => 'required|string|lowercase|max:255|unique:'.User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $data['password'] = Hash::make($request->password);
        $data['role'] = 'Patient';

        $user = $this->userContract->createOrUpdateUser($data);
        
        $userData = [
            'user_id' => $user->id,
            'firstname' => '',
            'middlename' => null,
            'lastname' => '',
            'gender' => null,
            'birthday' => null,
            'civil_status' => null,
            'religion' => '',
            'profile' => '',
        ];

        $this->userDetailContract->createOrUpdateUserDetail($userData);

        Auth::login($user);

        Session::flash('success', 'Account Successfully Created!');
        
        if($user->role === 'Administration') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } else if($user->role === 'Practitioner') {
            return redirect()->intended(route('practitioner.dashboard', absolute: false));
        } else if($user->role === 'Bhw') {
            return redirect()->intended(route('bhw.dashboard', absolute: false));
        } else {
            return redirect()->intended(route('patient.dashboard', absolute: false));
        }
    }
}
