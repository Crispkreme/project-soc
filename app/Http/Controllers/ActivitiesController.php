<?php

namespace App\Http\Controllers;

use App\Contracts\BarangayEventContract;
use App\Contracts\NotificationContract;
use App\Contracts\UserDetailContract;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class ActivitiesController extends Controller
{
    protected $barangayEventContract;
    protected $userDetailContract;
    protected $notificationContract;

    public function __construct(
        BarangayEventContract $barangayEventContract,
        UserDetailContract $userDetailContract,
        NotificationContract $notificationContract,
    ) {
        $this->notificationContract = $notificationContract;
        $this->barangayEventContract = $barangayEventContract;
        $this->userDetailContract = $userDetailContract;
    }

    public function getActivities()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $routeName = Route::currentRouteName();
        $accountType = match ($routeName) {
            // 'practitioner.book.appointments' => 'Practitioner',
            // 'patient.book.appointments' => 'Patient',
            'bhw.activities' => 'Bhw',
            'admin.activities' => 'Administration',
            default => 'login',
        };

        if (!$accountType) {
            return redirect()->route('login');
        }

        $viewPath = match ($accountType) {
            'Administration' => 'Admins/Activities/Activity',
            'Bhw' => 'Bhws/Activities/Activity',
            // 'Patient' => 'Patients/Appointments/Appointment',
            // 'Practitioner' => 'Practitioners/Appointments/Booked',
            default => 'login'
        };

        $barangayEvents = $this->barangayEventContract->getBarangayEvent();
        $doctors = $this->userDetailContract->getAllUserNameByRole('Practitioner', 'Active');
        $bhws = $this->userDetailContract->getAllUserNameByRole('Bhw', 'Active');
  
        return Inertia::render($viewPath, [
            'barangayEvents' => $barangayEvents,
            'doctors' => $doctors,
            'bhws' => $bhws,
        ]);
    }

    public function updateOrCreateBarangayEvent(Request $request, $id = null)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            
            DB::beginTransaction();

            $data = $request->validate([  
                'doctor_id' => 'nullable|exists:user_details,id',
                'bhw_id' => 'nullable|exists:user_details,id',
                'event_name' => 'required|string|max:255',
                'event_date' => 'required|date|after_or_equal:today',
                'event_start' => 'required|date_format:H:i|before:event_end',
                'event_end' => 'required|date_format:H:i|after:event_start',
                'event_venue' => 'required|string|max:255',
            ]);   

            if($user->role === 'Practitioner') {
                $existingEvent = $this->barangayEventContract->getDoctorBarangayEvent($user->id, $data['event_date']);
            } else {
                $existingEvent = $this->barangayEventContract->getDoctorBarangayEvent($data['doctor_id'], $data['event_date']);
            }
        
            if ($existingEvent) {
                Session::flash('error', 'The doctor already has a scheduled event on this date.');
            } else {
                if ($id) {
                    $data['id'] = $id; 

                    if($user->role === 'Practitioner') {
                        $data['doctor_id'] = $user->id; 
                        $this->barangayEventContract->updateOrCreateBarangayEvent($data);

                        $notification = [
                            'user_id' => $user->id,
                            'message' => 'Doctor has created new events',
                        ];
                        $this->notificationContract->createOrUpdateNotification($notification);

                    } else {

                        $notification = [
                            'user_id' => $user->id,
                            'message' => $user->role . ' has updated new events',
                        ];
                        $this->notificationContract->createOrUpdateNotification($notification);

                        $this->barangayEventContract->updateOrCreateBarangayEvent($data);
                    }
                    
                    Session::flash('success', 'New Edited Event successfully saved!');
                } else {

                    $notification = [
                        'user_id' => $user->id,
                        'message' => $user->role . ' has created new events',
                    ];

                    $this->notificationContract->createOrUpdateNotification($notification);
                    $this->barangayEventContract->updateOrCreateBarangayEvent($data);

                    Session::flash('success', 'New Event successfully saved!');
                }
            }
            
            DB::commit();
            
            return redirect()->back();

        } catch (Exception $e) {
            
            Log::error('Error during updateOrCreateBarangayEvent: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return redirect()->back()->with('error', 'Unable to set the event. The date has already passed!');
        }
    }

    public function getUpcomingBarangayEvent()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $barangayEvents = $this->barangayEventContract->getUpcomingBarangayEvent();
        return response()->json(['barangayEvents' => $barangayEvents ]);
    }

    public function getNotification()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $notifications = $this->notificationContract->getNotificationByRole($user->role);

        $formattedNotifications = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->message,
                'created_at' => $notification->created_at->toFormattedDateString(),
            ];
        });

        return response()->json(['notifications' => $formattedNotifications]);
    }
}