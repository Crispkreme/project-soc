<?php

namespace App\Providers;

use App\Contracts\InventoryContract;
use App\Contracts\LedgerContract;
use App\Contracts\MedicineContract;
use App\Contracts\UserContract;
use App\Contracts\UserDetailContract;
use App\Repositories\InventoryRepository;
use App\Repositories\LedgerRepository;
use App\Repositories\MedicineRepository;
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
