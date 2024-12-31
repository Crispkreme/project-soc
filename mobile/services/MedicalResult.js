import axios from "../utils/axios";

export async function getTestResult(userId) {
    try {
        const response = await axios.get(`/mobile/test/result/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test results:", error);
        throw error;
    }
}
export async function getImmunizationResult(userId) {
    try {
        const response = await axios.get(`/mobile/immunization/result/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test results:", error);
        throw error;
    }
}