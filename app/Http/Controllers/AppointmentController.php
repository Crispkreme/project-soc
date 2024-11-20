<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
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

    public function __construct(
        BookingContract $bookingContract,
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        AppointmentContract $appointmentContract,
    ) {
        $this->userDetailContract = $userDetailContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->bookingContract = $bookingContract;
        $this->appointmentContract = $appointmentContract;
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
            // TEMP DELETE AFTER
            'practitioner.book.appointments.booked' => 'Practitioner',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Appointments/Appointment',
            'Patient' => 'Patients/Appointments/Appointment',
            // TEMP DELETE AFTER
            'Practitioner' => 'Practitioners/Appointments/Booked',
            default => 'login'
        };

        $barangayEvents = $this->barangayEventContract->getLatestBarangayEvent();
        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', 'Active');
        $consultations = $this->appointmentContract->getAllAppointmentByMonth();

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
        $doctors = $this->userDetailContract->getAllUserByRole('Practitioner', 'Active');
        $bookings = $this->bookingContract->getAllBooking();
        
        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
            'doctors' => $doctors,
            'bookings' => $bookings,
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
}
