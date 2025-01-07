import axios from "../utils/axios";

export async function storeHealthRecord(data) {
    try {
        const response = await axios.post(`/mobile/store/health/record`, data);
        console.log('health record', response.data);
        return response.data;
    } catch (error) {
        console.error("Error storing health records:", error);
        throw error;
    }
}

export async function storeSurgicalRecord(data) {
    try {
        const response = await axios.post(`/mobile/store/surgical/record`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing surgical records:", error);
        throw error;
    }
}

export async function storeMedicationRecord(data) {
    try {
        const response = await axios.post(`/mobile/store/medication/record`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing surgical records:", error);
        throw error;
    }
}

export async function storeFamilyRecord(data) {
    try {
        const response = await axios.post(`/mobile/store/family/record`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing surgical records:", error);
        throw error;
    }
}

export async function storeTestResult(data) {
    try {
        const response = await axios.post(`/mobile/store/test/result`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing test results:", error);
        throw error;
    }
}

export async function storeImmunizationResult(data) {
    try {
        const response = await axios.post(`/mobile/store/immunization/result`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing test results:", error);
        throw error;
    }
}
