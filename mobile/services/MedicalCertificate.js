import axios from "../utils/axios";

export async function getMedicalCertificate(userId) {
    try {
        const response = await axios.get(`/mobile/medical/certificate/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}