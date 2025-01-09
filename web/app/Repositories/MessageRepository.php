<?php

namespace App\Repositories;

use App\Contracts\MessageContract;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class MessageRepository implements MessageContract
{

    protected $model;

    public function __construct(Message $model)
    {
        $this->model = $model;
    }

    public function getConversation($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        return $this->model
            ->join('user_details as sender_details', 'messages.sender_id', '=', 'sender_details.user_id')
            ->join('user_details as receiver_details', 'messages.receiver_id', '=', 'receiver_details.user_id')
            ->select(
                'messages.*',
                'sender_details.firstname as sender_first_name',
                'sender_details.lastname as sender_last_name',
                'receiver_details.firstname as receiver_first_name',
                'receiver_details.lastname as receiver_last_name'
            )
            ->where(function ($query) use ($user, $id) {
                $query->where(function ($query) use ($user, $id) {
                    $query->where('messages.sender_id', $user->id)
                        ->where('messages.receiver_id', $id);
                })
                ->orWhere(function ($query) use ($user, $id) {
                    $query->where('messages.sender_id', $id)
                        ->where('messages.receiver_id', $user->id);
                });
            })
            ->orderBy('messages.created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'sender_id' => $message->sender_id,
                    'reciever_id' => $message->reciever_id,
                    'sender_name' => "{$message->sender_first_name} {$message->sender_last_name}",
                    'receiver_name' => "{$message->receiver_first_name} {$message->receiver_last_name}",
                    'message' => $message->message,
                    'date' => Carbon::parse($message->created_at)->format('F d, Y'),
                ];
            });
    }

    public function updateOrCreateMessage($data)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        return $this->model->updateOrCreate(
            [
                'id' => $data['id'] ?? null,
            ],
            [
                'sender_id' => $user->id,
                'receiver_id' => $data['receiver_id'],
                'message' => $data['message'],
            ]
        );
    }
}
