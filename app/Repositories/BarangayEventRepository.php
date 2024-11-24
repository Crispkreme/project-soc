<?php

namespace App\Repositories;

use App\Contracts\BarangayEventContract;
use App\Models\BarangayEvent;
use Carbon\Carbon;

class BarangayEventRepository implements BarangayEventContract
{

    protected $model;

    public function __construct(BarangayEvent $model)
    {
        $this->model = $model;
    }

    public function getLatestBarangayEvent()
    {
        $event = $this->model
            ->with([
                'doctor:id,firstname,middlename,lastname', 
                'bhw:id,firstname,middlename,lastname'
            ])
            ->latest('created_at')
            ->first();

        if (!$event) {
            return null;
        }

        $doctorName = trim("{$event->doctor->firstname} {$event->doctor->middlename} {$event->doctor->lastname}");
        $bhwName = trim("{$event->bhw->firstname} {$event->bhw->middlename} {$event->bhw->lastname}");

        return [
            'id' => $event->id,
            'doctor_name' => $doctorName,
            'bhw_name' => $bhwName,
            'event_name' => $event->event_name,
            'event_date' => $event->event_date,
            'event_start' => $event->event_start,
            'event_end' => $event->event_end,
            'event_venue' => $event->event_venue,
        ];
    }

    public function getAllBarangayEvent()
    {
        $events = $this->model->get();

        $groupedEvents = $events->groupBy(function ($event) {
            return Carbon::parse($event->event_date)->format('F Y');
        });
    
        return $groupedEvents;
    }

    public function getBarangayEvent()
    {
        return $this->model->get();
    }
}
