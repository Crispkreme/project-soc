import axios from "../utils/axios";

export async function getAllMessages(senderId, receiverId) {
  try {
    const response = await axios.get(
      `/mobile/client/message/senderid=${senderId}/receiverid=${receiverId}`
    );
    console.log("Service message response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function sendMessageToDoctor(data) {
  try {
    const response = await axios.post(`/mobile/send/message`, data);
    console.log('booking message', response);
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}