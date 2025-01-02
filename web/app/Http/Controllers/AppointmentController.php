<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\DataAnalyticContract;
use App\Contracts\HospitalContract;
use App\Contracts\LogContract;
use App\Contracts\MedicineContract;
use App\Contracts\PrescriptionContract;
use App\Contracts\ReferralContract;

use App\Contracts\ScheduleContract;
use App\Contracts\UserDetailContract;
use App\Models\BarangayEvent;
use Carbon\Carbon;
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
    protected $medicineContract;
    protected $logContract;
    protected $prescriptionContract;
    protected $dataAnalyticContract;

    public function __construct(
        BookingContract $bookingContract,
        MedicineContract $medicineContract,
        ReferralContract $referralContract,
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        AppointmentContract $appointmentContract,
        ScheduleContract $scheduleContract,
        HospitalContract $hospitalContract,
        LogContract $logContract,
        PrescriptionContract $prescriptionContract,
        DataAnalyticContract $dataAnalyticContract,
    ) {
        $this->dataAnalyticContract = $dataAnalyticContract;
        $this->prescriptionContract = $prescriptionContract;
        $this->medicineContract = $medicineContract;
        $this->referralContract = $referralContract;
        $this->hospitalContract = $hospitalContract;
        $this->logContract = $logContract;
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

        $bookings = $this->barangayEventContract->getBarangayEvent();
        $latestBarangayEvent = $this->barangayEventContract->getLatestBarangayEvent();
        $doctors = $this->userDetailContract->getAllUserNameByRole('Practitioner', 'Active');
        $bhws = $this->userDetailContract->getAllUserNameByRole('Bhw', 'Active');
        $consultations = $this->appointmentContract->getAllAppointmentByMonth();
        $schedules = $this->scheduleContract->getDoctorScheduleByID();

        return Inertia::render($viewPath, [
            'latestBarangayEvent' => $latestBarangayEvent,
            'bookings' => $bookings,
            'doctors' => $doctors,
            'bhws' => $bhws,
            'consultations' => $consultations,
            'schedules' => $schedules,
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
        $medicines = $this->medicineContract->getAllMedicine();

        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
            'doctors' => $doctors,
            'patients' => $patients,
            'bookings' => $bookings,
            'hospitals' => $hospitals,
            'medicines' => $medicines,
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

            return redirect()->back()->with('success', 'Schedule successfully added.');

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateSchedule: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Error please try again.');

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

            $logData = [  
                'doctor_id' => $user->id,
                'patient_id' => $patientId,
                'message' => 'has created a referral to other hospital',
                'log_status' => 'Success',
            ]; 
    
            $this->logContract->updateOrCreateLog($logData);

            DB::commit();

            return redirect()->back()->with('success', 'Referral successfully added.');

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateReferral: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Error please try again.');
        }
    }

    public function updateOrCreatePrescription(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            DB::beginTransaction();

            $patientId = $this->bookingContract->getPatientIdByBookingId($id);

            if (!$patientId) {
                throw new Exception('Patient ID not found for the booking.');
            }

            $validatedData = $request->validate([
                'medicines' => 'required|array|min:1',
                'medicines.*.medicine_id' => 'required|integer|exists:medicines,id',
                'medicines.*.quantity' => 'required|integer|min:1',
                'diagnosis' => 'nullable|string|max:255',
                'instruction' => 'nullable|string|max:255',
            ]);

            foreach ($validatedData['medicines'] as $medicine) {
                $prescriptionData = [
                    'patient_id' => $patientId,
                    'doctor_id' => $user->id,
                    'medicine_id' => $medicine['medicine_id'],
                    'quantity' => $medicine['quantity'],
                    'diagnosis' => $validatedData['diagnosis'] ?? null,
                    'instruction' => $validatedData['instruction'] ?? null,
                ];

                $this->prescriptionContract->updateOrCreatePrescription($prescriptionData);

                $analyticsData = [
                    'illness' => $validatedData['diagnosis'] ?? null,
                    'medicine_id' => $medicine['medicine_id'],
                    'quantity' => $medicine['quantity'],
                ];
                $this->dataAnalyticContract->updateOrCreateDataAnalytic($analyticsData);
            }

            $this->bookingContract->updateBookingstatus('Success', $id, $user->id);
            $this->appointmentContract->updateAppointmentStatusById('Success', $id);

            $logData = [
                'doctor_id' => $user->id,
                'patient_id' => $patientId,
                'message' => 'has created a prescription',
                'log_status' => 'Success',
            ];
            $this->logContract->updateOrCreateLog($logData);

            DB::commit();

            return redirect()->back()->with('success', 'Prescription saved successfully!');
            
        } catch (Exception $e) {
            Log::error('Error during updateOrCreatePrescription', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'An error occurred, please try again.');
        }
    }

    // for mobile
    private function formatEventTime($startTime, $endTime)
    {
        try {
            $start = Carbon::parse($startTime)->format('h:i A');
            $end = Carbon::parse($endTime)->format('h:i A');
            return "{$start} - {$end}";
        } catch (\Exception $e) {
            return 'N/A';
        }
    }
    private function formatFullName($firstname, $middlename, $lastname)
    {
        return trim(implode(' ', array_filter([$firstname, $middlename, $lastname])));
    }
    public function getBarangayEventMobile()
    {
        $barangayEvents = BarangayEvent::with(['doctor', 'bhw'])->get()->map(function ($event) {
            return [
                'id' => $event->id,
                'doctor_id' => $event->doctor_id,
                'bhw_id' => $event->bhw_id,
                'event_name' => $event->event_name,
                'event_start' => $event->event_start,
                'event_end' => $event->event_end,
                'event_time' => ($event->event_start && $event->event_end)
                    ? $this->formatEventTime($event->event_start, $event->event_end)
                    : 'N/A',
                'event_venue' => $event->event_venue,
                'doctor_name' => optional($event->doctor, function ($doctor) {
                    return $this->formatFullName($doctor->firstname, $doctor->middlename, $doctor->lastname);
                }),
                'bhw_name' => optional($event->bhw, function ($bhw) {
                    return $this->formatFullName($bhw->firstname, $bhw->middlename, $bhw->lastname);
                }),
                'event_date' => $event->event_date
                    ? Carbon::parse($event->event_date)->format('F j, Y')
                    : null,
            ];
        });

        if ($barangayEvents->isEmpty()) {
            return response()->json(['message' => 'No Barangay Event found'], 404);
        }

        return response()->json(['barangayEvents' => $barangayEvents]);
    }
    public function storeBooking(Request $request)
    {
        try {
            DB::beginTransaction();

            $user_id = $request->input('user_id');
            $event_id = $request->input('event_id');
            $event_date = $request->input('event_date');
            $event_start = $request->input('event_start');
            $event_end = $request->input('event_end');
            $event_name = $request->input('event_name');

            $existingBookings = $this->bookingContract->checkExistingBooking(
                $event_date, 
                $event_start, 
                $event_end
            );

            if ($existingBookings >= 2) {
                return response()->json(['message' => 'The selected time slot is already fully booked. Please select another time.'], 404);
            }

            $existingPatientBookings = $this->bookingContract->checkPatientExistingBooking(
                $user_id, 
                $event_start,
                $event_end
            );

            if ($existingPatientBookings >= 1) {
                return response()->json(['message' => 'You have already booked for this event.'], 404);
            }

            $data = [
                'patient_id' => $user_id,
                'event_id' => $event_id,
                'appointment_date' => $event_date,
                'appointment_start' => $event_start,
                'appointment_end' => $event_end,
                'title' => $event_name,
                'notes' => 'Create a Booking',
                'booking_status' => 'Pending',
            ];

            if ($existingBookings < 2 && $existingPatientBookings < 1) {
                $this->bookingContract->createOrUpdateBooking($data);
                
                $logData = [
                    'patient_id' => $user_id,
                    'message' => 'has booked an appointment',
                    'log_status' => 'Accept',
                ];
                $this->logContract->updateOrCreateLog($logData);
                
                DB::commit();

                return response()->json(['message' => 'Appointment saved successfully!'], 202);
            }

            DB::rollback();
            return response()->json(['message' => 'Booking could not be saved.'], 500);
        } catch (Exception $e) {
            Log::error('Error during storeBooking: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return response()->json(['message' => 'An error occurred during the booking process.'], 500);
        }
    }
}
