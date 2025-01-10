import axios from "../utils/axios";

export async function getAllMessages(data) {
    try {
        const response = await axios.get(`/mobile/client/message/`, {
            params: {
                sender_id: data.senderId,
                receiver_id: data.receiverId,
            },
        });
        return response.data.message;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
}

