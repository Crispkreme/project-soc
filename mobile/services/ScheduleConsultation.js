import axios from "../utils/axios";

export async function getScheduleConsultation(userId) {
    try {
        const response = await axios.get(`/mobile/schedule/consultation`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}