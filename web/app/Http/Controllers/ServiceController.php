<?php

namespace App\Http\Controllers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\DataAnalyticContract;
use App\Contracts\LedgerContract;
use App\Contracts\MedicineContract;
use App\Contracts\UserDetailContract;
use App\Models\BarangayEvent;
use App\Models\Ledger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class ServiceController extends Controller
{
    protected $barangayEventContract;
    protected $userDetailContract;
    protected $appointmentContract;
    protected $ledgerContract;
    protected $medicineContract;
    protected $bookingContract;
    protected $dataAnalyticContract;

    public function __construct(
        DataAnalyticContract $dataAnalyticContract,
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        AppointmentContract $appointmentContract,
        LedgerContract $ledgerContract,
        BookingContract $bookingContract,
        MedicineContract $medicineContract,
    ) {
        $this->dataAnalyticContract = $dataAnalyticContract;
        $this->bookingContract = $bookingContract;
        $this->userDetailContract = $userDetailContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->appointmentContract = $appointmentContract;
        $this->ledgerContract = $ledgerContract;
        $this->medicineContract = $medicineContract;
    }
    
    public function getAllServiceAvailable()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.service.availables' => 'Practitioner',
            'patient.show.service.availables' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/Service',
            'Patient' => 'Patients/Services/Service',
            default => 'login'
        };

        return Inertia::render($viewPath);
        
    }

    public function getAllScheduleConsultation()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.schedule.consultations' => 'Practitioner',
            'patient.show.schedule.consultations' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }
        
        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/Consultation',
            'Patient' => 'Patients/Services/Consultation',
            default => 'login'
        };

        $consultations = $this->barangayEventContract->getAllBarangayEventByMonth();

        return Inertia::render($viewPath, [
            'consultations' => $consultations
        ]);
    }

    public function getAllMedicineAvailable()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.report.medicine.available' => 'Practitioner',
            'patient.show.medicine.available' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Reports/Medicine',
            'Patient' => 'Patients/Services/Medicine',
            default => 'login'
        };

        $inventories = $this->ledgerContract->getAllLedger();

        return Inertia::render($viewPath, [
            'inventories' => $inventories,
        ]);
    }

    public function getAllDataAnalysis()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'admin.show.data.analysis' => 'Administrator',
            'bhw.show.data.analysis' => 'Bhw',
            'practitioner.show.data.analysis' => 'Practitioner',
            'patient.show.data.analysis' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $dataAnalytic = $this->dataAnalyticContract->getAllDataAnalyticByMonth();

        $viewPath = match ($accountType) {
            'Administrator' => 'Admins/Reports/DataAnalysis',
            'Bhw' => 'Bhws/Reports/DataAnalysis',
            'Practitioner' => 'Practitioners/Services/DataAnalysis',
            'Patient' => 'Patients/Services/DataAnalysis',
            default => 'login'
        };

        return Inertia::render($viewPath, [
            'dataAnalytic' => $dataAnalytic,
        ]);
    }  
    
    public function getAllBhwActivities()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            'practitioner.show.bhw.activities' => 'Practitioner',
            'patient.show.bhw.activities' => 'Patient',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Practitioner' => 'Practitioners/Services/BhwActivity',
            'Patient' => 'Patients/Services/BhwActivity',
            default => 'login'
        };
        $barangayEvents = $this->barangayEventContract->getAllBarangayEvent();
        
        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
        ]);
    }  

    // for mobile
    public function getMedicineAvailableMobile()
    {
        $inventories = Ledger::join('medicines', 'ledgers.medicine_id', '=', 'medicines.id')
        ->select(
            'ledgers.sold',
            'ledgers.in_stock',
            'ledgers.expiration_date',
            'ledgers.dosage',
            'medicines.medicine_name',
            'medicines.description',
            'medicines.id'
        )
        ->get()
        ->map(function ($record) {
            return [
                'medicine_name' => $record->medicine_name,
                'description' => $record->description,
                'dosage' => $record->dosage,
                'sold' => $record->sold,
                'in_stock' => $record->in_stock,
                'expiration_date' => Carbon::parse($record->expiration_date)->format('F d, Y'),
            ];
        })
        ->filter(function ($record) {
            return $record['in_stock'] > 0;
        });;

        if ($inventories->isEmpty()) {
            return response()->json(['message' => 'No Medicine Available found'], 404);
        }

        return response()->json([
            'inventories' => $inventories
        ]);
    }
    public function getScheduleConsultationMobile()
    {
        $barangayEvents = BarangayEvent::join('user_details as doctor_details', 'barangay_events.doctor_id', '=', 'doctor_details.id')
        ->join('users as doctor_users', 'doctor_details.user_id', '=', 'doctor_users.id')
        ->select([
            DB::raw("CONCAT(doctor_details.firstname, ' ', COALESCE(doctor_details.middlename, ''), ' ', doctor_details.lastname) as doctor_name"),
            'doctor_users.role as role',
            'barangay_events.event_name as event_name',
            'barangay_events.event_date as event_date',
            'barangay_events.event_venue as venue',
            DB::raw("CONCAT(barangay_events.event_start, ' - ', barangay_events.event_end) as event_time")
        ])
        ->whereNotNull('barangay_events.event_date')
        ->get();

        $groupedEvents = $barangayEvents->groupBy(function ($event) {
            return Carbon::parse($event->event_date)->format('F Y');
        });

        if ($groupedEvents->isEmpty()) {
            return response()->json(['message' => 'No Schedule Available found'], 404);
        }

        return response()->json([
            'groupedEvents' => $groupedEvents
        ]);
    }
}
