import axios from "../utils/axios";

export async function getMedicineRequester(userId) {
    try {
        const response = await axios.get(`/mobile/get/all/medicine/requester/${userId}`);
        console.log("medicine requester", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}