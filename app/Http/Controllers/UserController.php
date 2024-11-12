<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function getAllCommunity()
    {
        return Inertia::render('Patients/Communities/Community');
    }
}
