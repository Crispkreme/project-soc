import axios from "../utils/axios";

export async function getBarangayEvent() {
    try {
        const response = await axios.get(`/mobile/barangay/event`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}

export async function getUpcomingBarangayEvent() {
    try {
        const response = await axios.get('/mobile/upcoming/barangay/event');
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming barangay event:", error);
        throw error;
    }
}

export async function storeBarangayEvent(data) {
    try {
        const response = await axios.post(`/mobile/store/booking`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing barangay event:", error);
        throw error;
    }
}
