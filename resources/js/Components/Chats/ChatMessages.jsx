import React, { useState, useEffect, useRef } from "react";
import { usePage } from '@inertiajs/react';
import axios from "axios";

const ChatMessages = ({ id }) => {
  const user = usePage().props.auth.user;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/get/user/conversation/${id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000);

      return () => clearInterval(intervalId);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e.key === "Enter" && message.trim()) {
      try {
        const receiverId = id;
  
        await axios.post(`/sent/user/message/${receiverId}`, {
          message,
          receiver_id: receiverId,
        });
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender_id: user.id, message },
        ]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-5 flex flex-col justify-between">
      <div className="flex flex-col mt-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.sender_id !== user.id && (
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="object-cover h-8 w-8 rounded-full"
                alt="Sender"
              />
            )}

            <div
              className={`py-3 px-4 rounded-xl ${message.sender_id === user.id
                ? 'bg-blue-400 text-white rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
                : 'bg-gray-400 text-white rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
              }`}
            >
              {message.message}
            </div>

            {message.sender_id === user.id && (
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="object-cover h-8 w-8 rounded-full"
                alt="Receiver"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="py-5">
        <input
          className="w-full bg-gray-300 py-5 px-3 rounded-xl"
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatMessages;
