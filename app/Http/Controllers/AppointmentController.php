<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\HospitalContract;
use App\Contracts\ReferralContract;
use App\Contracts\ScheduleContract;
use App\Contracts\UserDetailContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    protected $barangayEventContract;
    protected $userDetailContract;
    protected $bookingContract;
    protected $appointmentContract;
    protected $scheduleContract;
    protected $hospitalContract;
    protected $referralContract;

    public function __construct(
        BookingContract $bookingContract,
        
        ReferralContract $referralContract,
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        AppointmentContract $appointmentContract,
        ScheduleContract $scheduleContract,
        HospitalContract $hospitalContract,
    ) {
        $this->referralContract = $referralContract;
        $this->hospitalContract = $hospitalContract;
        $this->userDetailContract = $userDetailContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->bookingContract = $bookingContract;
        $this->appointmentContract = $appointmentContract;
        $this->scheduleContract = $scheduleContract;
    }

    public function bookAppointment()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.book.appointments' => 'Practitioner',
            'patient.book.appointments' => 'Patient',
            'practitioner.book.appointments.booked' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Appointments/Appointment',
            'Patient' => 'Patients/Appointments/Appointment',
            'Practitioner' => 'Practitioners/Appointments/Booked',
            default => 'login'
        };

        $barangayEvents = $this->barangayEventContract->getBarangayEvent();
        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', 'Active');
        $consultations = $this->appointmentContract->getAllAppointmentByMonth();
        $schedules = $this->scheduleContract->getDoctorScheduleByID();
 
        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
            'doctors' => $doctors,
            'consultations' => $consultations,
        ]);
    }

    public function bookedAppointment()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.book.appointments.booked' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Appointments/Booked',
            default => 'login'
        };

        $barangayEvents = $this->barangayEventContract->getLatestBarangayEvent();
        $doctors = $this->userDetailContract->getAllUserNameByRole('Practitioner', 'Active');
        $patients = $this->userDetailContract->getAllUserNameByRole('Patient', 'Active');
        $bookings = $this->bookingContract->getAllBooking();
        $hospitals = $this->hospitalContract->getAllHospital();

        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
            'doctors' => $doctors,
            'patients' => $patients,
            'bookings' => $bookings,
            'hospitals' => $hospitals,
        ]);
    }

    public function approveAppointment($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            
            DB::beginTransaction();

            $bookings = $this->bookingContract->getBookingById($id);
            $bookingData = [
                "id" => $bookings->id,
                "approve_by_id" => $user->id,
                "patient_id" => $bookings->patient_id,
                "title" => $bookings->title,
                "notes" => $bookings->notes,
                "appointment_date" => $bookings->appointment_date,
                "appointment_start" => $bookings->appointment_start,
                "appointment_end" => $bookings->appointment_end,
                "approved_date" => now()->format('Y-m-d H:i:s'),
                "booking_status" => 'Pending',
            ];
        
            $updatedbooking = $this->bookingContract->createOrUpdateBooking($bookingData);

            $appointmentData = [
                "booking_id" => $updatedbooking->id,
                "doctor_id" => $user->id,
                "slot" => 1,
                "appointment_status" => $updatedbooking->booking_status,
            ];
            $this->appointmentContract->createOrUpdateAppointment($appointmentData);

            DB::commit();
            
            Session::flash('success', 'Appointment updated successfully!');

        } catch (Exception $e) {
            
            Log::error('Error during approveAppointment: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            Session::flash('error', 'An error occurred during approveAppointment.');
            return redirect()->back();
        }
        
    }   

    public function updateOrCreateSchedule(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            
            DB::beginTransaction();

            $data = $request->validate([  
                'barangay_event_id' => 'nullable|exists:barangay_events,id',
                'notes' => 'nullable|string',
                'appointment_date' => 'required|date',
                'appointment_start' => 'required|date_format:H:i',
                'appointment_end' => 'required|date_format:H:i|after:appointment_start',
            ]);   
            $data['doctor_id'] = $user->id;  
  
            if ($id) {
                $data['id'] = $id; 
                $this->scheduleContract->updateOrCreateSchedule($data);
            } else {
                $this->scheduleContract->updateOrCreateSchedule($data);
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Schedule successfully added.',
            ]);

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateSchedule: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return response()->json([
                'error' => true,
                'message' => 'Error please try again.',
            ]);
        }
    }

    public function updateOrCreateReferral(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            
            DB::beginTransaction();
            $patientId = $this->bookingContract->getPatientIdByBookingId($id);
            $data = $request->validate([  
                'doctor_id' => 'nullable|exists:users,id',
                'refer_to_id' => 'nullable|exists:users,id',
                'hospital_id' => 'nullable|exists:hospitals,id',
                'reason' => 'required|string|max:65535',
            ]);   
            $data['referral_status'] = 'Inprogress';  
            $data['patient_id'] = $patientId; 
            $data['doctor_id'] = $user->id; 
  
            $this->referralContract->updateOrCreateReferral($data);

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Referral successfully added.',
            ]);

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateReferral: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return response()->json([
                'error' => true,
                'message' => 'Error please try again.',
            ]);
        }
    }
}
