<?php

namespace App\Http\Controllers;

use App\Contracts\MessageContract;
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

}
