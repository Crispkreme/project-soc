<?php

namespace App\Contracts;

interface MessageContract {

    public function getConversation($id);
    public function updateOrCreateMessage($data);
}
