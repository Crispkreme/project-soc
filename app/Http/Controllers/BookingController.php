<?php

namespace App\Http\Controllers;

use App\Contracts\BookingContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $bookingContract;

    public function __construct(
        BookingContract $bookingContract,
    ) {
        $this->bookingContract = $bookingContract;
    }

    public function getAppointments()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $bookings = $this->bookingContract->getAllBooking();

        return Inertia::render('Admins/Appointments/Appointment', [
            'bookings' => $bookings,
        ]);
    }
}
