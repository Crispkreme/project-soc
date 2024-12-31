import axios from "../utils/axios";

export async function getMedicineAvailable() {
    try {
        const response = await axios.get(`/mobile/medicine/available`);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}