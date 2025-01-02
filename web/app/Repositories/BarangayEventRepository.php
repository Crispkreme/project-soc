<?php

namespace App\Repositories;

use App\Contracts\BarangayEventContract;
use App\Models\BarangayEvent;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BarangayEventRepository implements BarangayEventContract
{

    protected $model;

    public function __construct(BarangayEvent $model)
    {
        $this->model = $model;
    }

    private function formatFullName($firstname, $middlename, $lastname)
    {
        return trim(implode(' ', array_filter([$firstname, $middlename, $lastname])));
    }

    private function formatEventTime($startTime, $endTime)
    {
        $start = Carbon::parse($startTime)->format('h:i a');
        $end = Carbon::parse($endTime)->format('h:i a');
        return "{$start} - {$end}";
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

        $doctorName = isset($event->doctor)
            ? trim("{$event->doctor->firstname} {$event->doctor->middlename} {$event->doctor->lastname}")
            : 'N/A';

        $bhwName = isset($event->bhw)
            ? trim("{$event->bhw->firstname} {$event->bhw->middlename} {$event->bhw->lastname}")
            : 'N/A';

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
                'event_start' => $event->event_start,
                'event_end' => $event->event_end,
                'event_time' => $event->event_start && $event->event_end
                    ? $this->formatEventTime($event->event_start, $event->event_end)
                    : 'N/A',
                'event_venue' => $event->event_venue,
                'doctor_name' => $event->doctor
                    ? $this->formatFullName($event->doctor->firstname, $event->doctor->middlename, $event->doctor->lastname)
                    : null,
                'bhw_name' => $event->bhw
                    ? $this->formatFullName($event->bhw->firstname, $event->bhw->middlename, $event->bhw->lastname)
                    : null,
                'event_date' => $event->event_date 
                    ? Carbon::parse($event->event_date)->format('F j, Y')
                    : null,
            ];
        });
    }

    public function getDoctorBarangayEvent($id, $data)
    {
        return $this->model->where('doctor_id', $id)
        ->whereDate('event_date', $data)
        ->first();
    }

    public function getUpcomingBarangayEvent()
    {
        $today = now()->startOfDay();

        $event = $this->model
            ->where('event_date', '>=', $today)
            ->with(['doctor:id,firstname,middlename,lastname'])
            ->orderBy('event_date', 'asc')
            ->first();

        if ($event) {
            if ($event->doctor) {
                $doctor = $event->doctor;
                $event->doctor_name = trim("{$doctor->firstname} {$doctor->middlename} {$doctor->lastname}");
            }

            $event->event_date = Carbon::parse($event->event_date)->format('l, F d, Y');
            $event->event_start = Carbon::parse($event->event_start)->format('h:i a');
            $event->event_end = Carbon::parse($event->event_end)->format('h:i a');

            unset($event->doctor);
        }

        return $event;
    }

    public function getAllBarangayEventByMonth()
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

        return $groupedEvents;
    }
}
