import React, { Suspense } from 'react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const ChatHeader = React.lazy(() => import("@/Components/Chats/ChatHeader"));
const ChatList = React.lazy(() => import("@/Components/Chats/ChatList"));
const ChatMessages = React.lazy(() => import("@/Components/Chats/ChatMessages"));
const ChatSidebar = React.lazy(() => import("@/Components/Chats/ChatSidebar"));

const UserMessage = ({ reciever_id }) => {
  return (
    <Suspense fallback={<div className="text-center py-4">Loading layout...</div>}>
      <AdminLayout>
        <div className="container mx-auto shadow-lg rounded-lg h-full">
          <ChatHeader />
          <div className="flex flex-row justify-between bg-white">
            <ChatList />
            <ChatMessages id={reciever_id}/>
          </div>
        </div>
      </AdminLayout>
    </Suspense>
  )
}

export default UserMessage
