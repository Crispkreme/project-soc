import axios from "../utils/axios";

export async function getAllDoctor() {
    try {
        const response = await axios.get(`/mobile/get/all/doctor`, );
        console.log('getAllDoctor', response.data);
        return response.data;
    } catch (error) {
        console.error("Error storing getAllDoctors:", error);
        throw error;
    }
}