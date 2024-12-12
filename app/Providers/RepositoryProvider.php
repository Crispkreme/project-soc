<?php

namespace App\Providers;

use App\Contracts\AppointmentContract;
use App\Contracts\BarangayEventContract;
use App\Contracts\BookingContract;
use App\Contracts\DataAnalyticContract;
use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\HospitalContract;
use App\Contracts\HospitalizationContract;
use App\Contracts\ImmunizationContract;
use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
use App\Contracts\LogContract;
use App\Contracts\MedicalCertificateContract;
use App\Contracts\MedicalRecordContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use App\Contracts\MessageContract;
use App\Contracts\PrescriptionContract;
use App\Contracts\ReferralContract;
use App\Contracts\ScheduleContract;
use App\Contracts\SurgicalContract;
use App\Contracts\TestResultContract;
use App\Contracts\UserContract;

use App\Contracts\UserDetailContract;
use App\Repositories\AppointmentRepository;
use App\Repositories\BarangayEventRepository;
use App\Repositories\BookingRepository;
use App\Repositories\DataAnalyticRepository;
use App\Repositories\FamilyMedicalRepository;
use App\Repositories\HealthRepository;
use App\Repositories\HospitalizationRepository;
use App\Repositories\HospitalRepository;
use App\Repositories\ImmunizationRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\LedgerRepository;
use App\Repositories\LogRepository;
use App\Repositories\MedicalCertificateRepository;
use App\Repositories\MedicalRecordRepository;
use App\Repositories\MedicationRepository;
use App\Repositories\MedicineRepository;
use App\Repositories\MessageRepository;
use App\Repositories\PrescriptionRepository;
use App\Repositories\ReferralRepository;
use App\Repositories\ScheduleRepository;
use App\Repositories\SurgicalRepository;
use App\Repositories\TestResultRepository;
use App\Repositories\UserDetailRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryProvider extends ServiceProvider
{
    protected $repositories = [
        UserContract::class => UserRepository::class,
        UserDetailContract::class => UserDetailRepository::class,
        MedicineContract::class => MedicineRepository::class,
        InventoryContract::class => InventoryRepository::class,
        LedgerContract::class => LedgerRepository::class,
        BookingContract::class => BookingRepository::class,
        HealthContract::class => HealthRepository::class,
        SurgicalContract::class => SurgicalRepository::class,
        MedicationContract::class => MedicationRepository::class,
        FamilyMedicalContract::class => FamilyMedicalRepository::class,
        TestResultContract::class => TestResultRepository::class,
        ImmunizationContract::class => ImmunizationRepository::class,
        HospitalizationContract::class => HospitalizationRepository::class,
        MedicalRecordContract::class => MedicalRecordRepository::class,
        BarangayEventContract::class => BarangayEventRepository::class,
        AppointmentContract::class => AppointmentRepository::class,
        HospitalContract::class => HospitalRepository::class,
        ScheduleContract::class => ScheduleRepository::class,
        ReferralContract::class => ReferralRepository::class,
        PrescriptionContract::class => PrescriptionRepository::class,
        LogContract::class => LogRepository::class,
        MessageContract::class => MessageRepository::class,
        MedicalCertificateContract::class => MedicalCertificateRepository::class,
        DataAnalyticContract::class => DataAnalyticRepository::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        foreach($this->repositories as $contract => $repository) {
            $this->app->singleton($contract,$repository);
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
