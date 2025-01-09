import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <ul class="max-h-64 overflow-y-auto hidden" data-tab-for="notification" data-page="messages">
      {messages.map((message, index) => (
        <li key={index}>
          <a href={message.link} className="py-2 px-4 flex items-center hover:bg-gray-50 group">
            <img
              src={message.image}
              alt=""
              className="w-8 h-8 rounded block object-cover align-middle"
            />
            <div className="ml-2">
              <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">
                {message.sender}
              </div>
              <div className="text-[11px] text-gray-400">{message.content}</div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
