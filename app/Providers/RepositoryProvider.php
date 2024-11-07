<?php

namespace App\Providers;

use App\Contracts\BookingContract;
use App\Contracts\FamilyMedicalContract;
use App\Contracts\HealthContract;
use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
use App\Contracts\MedicationContract;
use App\Contracts\MedicineContract;
use App\Contracts\SurgicalContract;
use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use App\Repositories\BookingRepository;
use App\Repositories\FamilyMedicalRepository;
use App\Repositories\HealthRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\LedgerRepository;
use App\Repositories\MedicationRepository;
use App\Repositories\MedicineRepository;
use App\Repositories\SurgicalRepository;
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
