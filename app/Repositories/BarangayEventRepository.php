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

    public function updateOrCreateBarangayEvent($data)
    {
        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'doctor_id' => $data['doctor_id'] ?? null,
                'bhw_id' => $data['bhw_id'] ?? null,
                'event_name' => $data['event_name'],
                'event_start' => $data['event_start'],
                'event_date' => $data['event_date'],
                'event_end' => $data['event_end'],
                'event_venue' => $data['event_venue'],
            ]
        );
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
        return $this->model->with(['doctor', 'bhw'])->get()->map(function ($event) {
            return [
                'id' => $event->id,
                'doctor_id' => $event->doctor_id,
                'bhw_id' => $event->bhw_id,
                'event_name' => $event->event_name,
                'event_date' => $event->event_date,
                'event_start' => $event->event_start,
                'event_end' => $event->event_end,
                'event_time' => $event->event_start && $event->event_end
                    ? "{$event->event_start} - {$event->event_end}"
                    : 'N/A',
                'event_venue' => $event->event_venue,
                'doctor_name' => $event->doctor 
                    ? trim("{$event->doctor->firstname} {$event->doctor->middlename} {$event->doctor->lastname}")
                    : null,
                'bhw_name' => $event->bhw 
                    ? trim("{$event->bhw->firstname} {$event->bhw->middlename} {$event->bhw->lastname}")
                    : null,
                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at,
            ];
        });
    }
}
