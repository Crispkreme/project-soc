<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        if($user->role === 'Administration') {
            return Inertia::render('Admins/Dashboard');
        } else if($user->role === 'Practitioner') {
            return Inertia::render('Practitioners/Dashboard');
        } else if($user->role === 'Bhw') {
            return Inertia::render('Bhws/Dashboard');
        } else {
            return Inertia::render('Patients/Dashboard');
        }
    }
}
