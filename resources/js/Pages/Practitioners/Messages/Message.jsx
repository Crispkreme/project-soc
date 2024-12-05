import React, { Suspense } from 'react';

const ChatHeader = React.lazy(() => import("@/Components/Chats/ChatHeader"));
const ChatList = React.lazy(() => import("@/Components/Chats/ChatList"));
const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));

const Message = () => {
  return (
    <Suspense fallback={<div className="text-center py-4">Loading layout...</div>}>
      <PatientLayout>
        <div className="container mx-auto shadow-lg rounded-lg h-full">
          <ChatHeader />
          <div className="flex flex-row justify-between bg-white">
            <ChatList />
          </div>
        </div>
      </PatientLayout>
    </Suspense>
  )
}

export default Message
