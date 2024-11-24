<?php

namespace App\Http\Controllers\Auth;

use App\Contracts\UserDetailContract;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    protected $userDetailContract;

    public function __construct(
        UserDetailContract $userDetailContract,
    ) {
        $this->userDetailContract = $userDetailContract;
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();        
        $userDetail = $this->userDetailContract->getUserDetailById($user->id);

        if (!$userDetail) {
            return response()->json([
                'message' => 'User details not found.',
            ], 404);
        }

        $userStatus = $userDetail->status;

        if ($userStatus === 'Deactivate') {

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Account Deactivated',
                'redirect_url' => route('login'),
            ]);
        }

        $roleRoutes = [
            'Administration' => 'admin.dashboard',
            'Practitioner' => 'practitioner.dashboard',
            'Patient' => 'patient.dashboard',
        ];
        $redirectRoute = $roleRoutes[$user->role] ?? 'login';
        
        // return response()->json([
        //     'message' => 'Login successful',
        // ]);

        return redirect()->route($redirectRoute);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
