<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BookingContract;
use App\Contracts\PrescriptionContract;
use App\Contracts\ReferralContract;
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
    protected $referralContract;
    protected $prescriptionContract;
    protected $appointmentContract;

    public function __construct(
        BookingContract $bookingContract,
        ReferralContract $referralContract,
        PrescriptionContract $prescriptionContract,
        AppointmentContract $appointmentContract,
    ) {
        $this->bookingContract = $bookingContract;
        $this->prescriptionContract = $prescriptionContract;
        $this->appointmentContract = $appointmentContract;
        $this->referralContract = $referralContract;
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
                'appointment_start' => 'nullable|date_format:H:i:s',
                'appointment_end' => 'nullable|date_format:H:i:s',
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
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $this->bookingContract->updateBookingstatus('Pending', $id);

        return response()->json([
            'success' => 'success',
            'message' => 'Account added successfully!',
        ]);
    }

    public function getReferral()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $referrals = $this->referralContract->getAllReferral();

        return Inertia::render('Admins/Referrals/Referral', [
            'referrals' => $referrals,
        ]);
    }

    public function getPrescription()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $prescriptions = $this->prescriptionContract->getAllPrescription();

        return Inertia::render('Admins/Prescriptions/Prescription', [
            'prescriptions' => $prescriptions,
        ]);
    }
}
