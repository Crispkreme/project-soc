import axios from "../utils/axios";

export async function getAllBooking(id) {
    try {
        const response = await axios.get(`/mobile/get/all/patient/booking/${id}`);
        console.log('booking message', response);
        return response;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
}
