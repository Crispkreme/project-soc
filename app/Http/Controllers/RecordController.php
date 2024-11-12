<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RecordController extends Controller
{
    public function getAllMedical()
    {
        return Inertia::render('Patients/Records/Medical');
    }  
    
    public function getAllHistory()
    {
        return Inertia::render('Patients/Records/History');
    }
}
