import React from 'react';

const NotificationList = ({ notifications }) => {
  return (
    <ul class="max-h-64 overflow-y-auto" data-tab-for="notification" data-page="notifications">
      {notifications.map((notification, index) => (
        <li key={index}>
          <a href={notification.link} className="py-2 px-4 flex items-center hover:bg-gray-50 group">
            <img
              src={notification.image}
              alt=""
              className="w-8 h-8 rounded block object-cover align-middle"
            />
            <div className="ml-2">
              <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">
                {notification.title}
              </div>
              <div className="text-[11px] text-gray-400">{notification.message}</div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
