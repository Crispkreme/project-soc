<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BookingContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $bookingContract;
    protected $appointmentContract;

    public function __construct(
        BookingContract $bookingContract,
        AppointmentContract $appointmentContract,
    ) {
        $this->bookingContract = $bookingContract;
        $this->appointmentContract = $appointmentContract;
    }

    public function getSchedules()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $bookings = $this->bookingContract->getAllBooking();
        
        return Inertia::render('Admins/Appointments/Schedule', [
            'bookings' => $bookings,
        ]);
    }

    public function getAppointments()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $appointments = $this->bookingContract->getAllBooking();
  
        return Inertia::render('Admins/Appointments/Appointment', [
            'appointments' => $appointments,
        ]);
    }

    public function createBooking(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            
            DB::beginTransaction();

            $data = $request->validate([  
                'title' => 'required|string|max:255',
                'notes' => 'nullable|string',
                'appointment_date' => 'nullable|date',
                'appointment_start' => 'nullable|date_format:H:i',
                'appointment_end' => 'nullable|date_format:H:i',
                'approved_date' => 'nullable|date',
                'booking_status' => 'nullable|in:Inprogress,Pending,Success,Failed',
            ]);     
            $data['approve_by_id'] = null; 
            $data['patient_id'] = $user->id; 

            if ($id) {
                $data['id'] = $id; 
                $this->bookingContract->createOrUpdateBooking($data);
            } else {
                $this->bookingContract->createOrUpdateBooking($data);
            }

            DB::commit();
            
            Session::flash('success', 'Booking updated successfully!');

        } catch (Exception $e) {
            
            Log::error('Error during createBooking: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            Session::flash('error', 'An error occurred during createBooking.');
            return redirect()->back();
        }
    }

    public function approveAppointments($id = null)
    {
        dd($id);
    }
}
