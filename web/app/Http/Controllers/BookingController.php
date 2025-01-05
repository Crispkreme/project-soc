<?php

namespace App\Http\Controllers;

use App\Contracts\UserDetailContract;
use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\LogContract;
use App\Contracts\PrescriptionContract;
use App\Contracts\ReferralContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $barangayEventContract;
    protected $bookingContract;
    protected $referralContract;
    protected $prescriptionContract;
    protected $appointmentContract;
    protected $logContract;
    protected $userDetailContract;

    public function __construct(
        BarangayEventContract $barangayEventContract,
        BookingContract $bookingContract,
        LogContract $logContract,
        ReferralContract $referralContract,
        PrescriptionContract $prescriptionContract,
        AppointmentContract $appointmentContract,
        UserDetailContract $userDetailContract,
    ) {
        $this->barangayEventContract = $barangayEventContract;
        $this->bookingContract = $bookingContract;
        $this->logContract = $logContract;
        $this->prescriptionContract = $prescriptionContract;
        $this->appointmentContract = $appointmentContract;
        $this->referralContract = $referralContract;
        $this->userDetailContract = $userDetailContract;
    }

    public function cancelBookingAppointment(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $userDetailId = $this->userDetailContract->getUserDetailById($user->id);
        $approverId = $userDetailId->id;
        $this->bookingContract->cancelBooking($id, $approverId, $request->reason);

        $logData = [  
            'doctor_id' => $user->id,
            'patient_id' => $request->patient_id,
            'message' => 'has cancel your book appointment',
            'log_status' => 'Success',
        ]; 

        $this->logContract->updateOrCreateLog($logData);

        return redirect()->back()->with('success', 'Appointment cancel.');
    }

    public function getSchedules()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }
        
        $bookings = $this->barangayEventContract->getBarangayEvent();

        return Inertia::render('Admins/Appointments/Schedule', [
            'bookings' => $bookings,
        ]);
    }

    public function getAppointments()
    {
        $user = Auth::user();

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'admin.appointments' => 'Administration',
            'bhw.appointments' => 'Bhw',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $appointments = $this->bookingContract->getAllBooking();
        
        $viewPath = match ($accountType) {
            'Administration' => 'Admins/Appointments/Appointment',
            'Bhw' => 'Bhws/Appointments/Appointment',
            default => 'login'
        };

        return Inertia::render($viewPath, [
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
                'approved_date' => 'nullable|date',
                'reason' => 'nullable|string',
                'booking_status' => 'nullable|in:Approve,Pending,Success,Failed',
            ]);

            $data['approve_by_id'] = null;
            $data['patient_id'] = $user->id;
            $data['title'] = $request->event_name;
            $data['notes'] = "Booking";
            $data['appointment_date'] = $request->event_date;
            $data['appointment_start'] = $request->event_start;
            $data['appointment_end'] = $request->event_end;
            $data['booking_status'] = 'Pending';

            $existingBookings = $this->bookingContract->checkExistingBooking(
                $request->event_date, 
                $request->event_start, 
                $request->event_end
            );

            if ($existingBookings >= 2) {
                Session::flash('error', 'The selected time slot is already fully booked. Please select another time.');
            }

            $existingPatientBookings = $this->bookingContract->checkPatientExistingBooking(
                $user->id, 
                $request->event_start,
                $request->event_end,
            );

            if ($existingPatientBookings >= 1) {
                Session::flash('error', 'You have already booked for this event.');
            }

            if ($existingBookings < 2 && $existingPatientBookings < 1) {
                if ($id) {
                    $data['id'] = $id;
                }
                $this->bookingContract->createOrUpdateBooking($data);
                
                $logData = [
                    'patient_id' => $user->id,
                    'message' => 'has booked an appointment',
                    'log_status' => 'Accept',
                ];
            
                $this->logContract->updateOrCreateLog($logData);
            
                Session::flash('success', 'Appointment saved successfully!');
            }
            
            DB::commit();
            return redirect()->back();

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
        
        $data = $this->bookingContract->updateBookingstatus('Approve', $id, $user->id);
        
        $slotData = $this->appointmentContract->checkBookingSlot($id);

        $slot = $slotData === 0 ? 1 : $slotData + 1;

        $appointmentData = [
            'doctor_id' => $user->id,
            'booking_id' => $id,
            'slot' => $slot,
            'appointment_status' => 'Pending',
        ];

        $this->appointmentContract->createOrUpdateAppointment($appointmentData);

        $logData = [
            'doctor_id' => $user->id,
            'patient_id' => $data->patient_id,
            'message' => 'has approved booked your appointment',
            'log_status' => 'Success',
        ];

        $this->logContract->updateOrCreateLog($logData);

        Session::flash('success', 'Appointment successfully approved.');

        return redirect()->back();
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
