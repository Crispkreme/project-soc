import axios from "../utils/axios";

export async function getBarangayEvent() {
    try {
        const response = await axios.get(`/mobile/barangay/event`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}