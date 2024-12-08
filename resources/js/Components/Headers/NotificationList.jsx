import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/get/notification");
        console.log("response", response);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="max-h-64 overflow-y-auto" data-tab-for="notification" data-page="notifications">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <li key={index}>
            <div className="py-2 px-4 flex items-center hover:bg-gray-50 group">
              <div className="ml-2">
                <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">
                  {notification.message}
                </div>
                <div className="text-[11px] text-gray-400">{notification.created_at}</div>
              </div>
            </div>
          </li>
        ))
      ) : (
        <li>No notifications available</li>
      )}
    </ul>
  );
};

export default NotificationList;
