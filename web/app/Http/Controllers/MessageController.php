<?php

namespace App\Http\Controllers;

use App\Contracts\MessageContract;
use App\Models\Message;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class MessageController extends Controller
{
    protected $messageContract;

    public function __construct(
        MessageContract $messageContract,
    ) {
        $this->messageContract = $messageContract;
    }

    public function getMessage()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Messages/Message',
            'Bhw' => 'Bhws/Messages/Message',
            'Practitioner' => 'Practitioners/Messages/Message',
            'Patient' => 'Patients/Messages/Message',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';


        return Inertia::render($redirectInertia);
    }

    public function getUserMessage($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $roleRoutes = [
            'Administration' => 'Admins/Messages/UserMessage',
            'Bhw' => 'Bhws/Messages/UserMessage',
            'Practitioner' => 'Practitioners/Messages/UserMessage',
            'Patient' => 'Patients/Messages/UserMessage',
        ];
        $redirectInertia = $roleRoutes[$user->role] ?? 'login';


        return Inertia::render($redirectInertia, [
            'reciever_id' => $id,
        ]);
    }

    public function getUserConversation($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $messages = $this->messageContract->getConversation($id);
        return response()->json(['messages' => $messages ]);
    }

    public function sentUserMessage(Request $request, $receiverId)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            DB::beginTransaction();

            $data = $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'message' => 'required|string|min:1|max:1000',
            ]);

            $data['receiver_id'] = $receiverId; 
            $data['sender_id'] = $user->id;

            $this->messageContract->updateOrCreateMessage($data);

            DB::commit();
            return response()->json(['status' => 'success']);

        } catch (Exception $e) {
            Log::error('Error during createBooking: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            DB::rollback();

            return response()->json(['status' => 'error', 'message' => 'An error occurred while sending the message.']);
        }
    }

    public function getAllMessageMobile(Request $request, $senderId, $receiverId)
    {
        try {
            // Validate input parameters
            if (!$senderId || !$receiverId) {
                return response()->json(['error' => 'Sender or receiver ID is missing.'], 400);
            }

            $messages = Message::join('user_details as sender_details', 'messages.sender_id', '=', 'sender_details.user_id')
                ->join('user_details as receiver_details', 'messages.receiver_id', '=', 'receiver_details.user_id')
                ->select(
                    'messages.*',
                    'sender_details.firstname as sender_first_name',
                    'sender_details.lastname as sender_last_name',
                    'receiver_details.firstname as receiver_first_name',
                    'receiver_details.lastname as receiver_last_name'
                )
                ->where(function ($query) use ($senderId, $receiverId) {
                    $query->where('messages.sender_id', $senderId)
                        ->where('messages.receiver_id', $receiverId);
                })
                ->orWhere(function ($query) use ($senderId, $receiverId) {
                    $query->where('messages.sender_id', $receiverId)
                        ->where('messages.receiver_id', $senderId);
                })
                ->orderBy('messages.created_at', 'asc')
                ->get()
                ->map(function ($message) {
                    return [
                        'sender_id' => $message->sender_id,
                        'receiver_id' => $message->receiver_id,
                        'sender_name' => "{$message->sender_first_name} {$message->sender_last_name}",
                        'receiver_name' => "{$message->receiver_first_name} {$message->receiver_last_name}",
                        'message' => $message->message,
                        'date' => Carbon::parse($message->created_at)->format('F d, Y'),
                    ];
                });

            return response()->json([
                'message' => $messages,
            ], 200);

        } catch (Exception $e) {
            Log::error('Error during getAllMessageMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'An error occurred while fetching messages. Please try again later.',
            ], 500);
        }
    }
 
    
    public function sendMessageToDoctorMobile(Request $request)
    {
        try {
            $data = $request->validate([
                'sender_id' => 'required|exists:users,id',
                'receiver_id' => 'required|exists:users,id',
                'message' => 'required|string|max:255',
            ]);

            Log::info('Sending message with data:', $data);

            $message = new Message();
            $message->sender_id = $data['sender_id'];
            $message->receiver_id = $data['receiver_id'];
            $message->message = $data['message'];

            $message->save();

            return response()->json([
                'message' => $message,
            ], 200);

        } catch (Exception $e) {
            Log::error('Error during sendMessageToDoctorMobile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'An error occurred while sending the message. Please try again later.',
            ], 500);
        }
    }
}
