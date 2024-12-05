import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from '@inertiajs/react';

const ChatList = () => {
  const account = usePage().props.auth.user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/get/all/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
      <div className="border-b-2 py-4 px-2">
        <input
          type="text"
          placeholder="search chatting"
          className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
        />
      </div>

      {users.map((user, index) => {
        let hrefValue = "#";
        if (account.role === "Administrator") {
          hrefValue = `/admin/message/user/${user.id}`;
        } else if (account.role === "Bhw") {
          hrefValue = `/bhw/message/user/${user.id}`;
        } else if (account.role === "Patient") {
          hrefValue = `/patient/message/user/${user.id}`;
        } else if (account.role === "Practitioner") {
          hrefValue = `/practitioner/message/user/${user.id}`;
        }

        return (
          <a
            href={hrefValue}
            key={index}
            className="flex flex-row py-4 px-2 items-center border-b-2"
          >
            <div className="w-1/4">
              <img
                src={user.image || "https://via.placeholder.com/150"}
                alt={user.name}
                className="object-cover h-12 w-12 rounded-full"
              />
            </div>
            <div className="w-full">
              <div className="text-lg font-semibold">{user.name}</div>
              <span className="text-gray-500">{user.role}</span> <br />
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.status}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default ChatList;
