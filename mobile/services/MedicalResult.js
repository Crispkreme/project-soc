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

export async function getHospitalizationResult(userId) {
    try {
        const response = await axios.get(`/mobile/hospitalization/result/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test results:", error);
        throw error;
    }
}

export async function getPrescriptionResult(userId) {
    try {
        const response = await axios.get(`/mobile/prescription/result/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test results:", error);
        throw error;
    }
}

export async function getHealthRecord(userId) {
    try {
        const response = await axios.get(`/mobile/health/record/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching health records:", error);
        throw error;
    }
}

export async function getSurgicalRecord(userId) {
    try {
        const response = await axios.get(`/mobile/surgical/record/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching surgical records:", error);
        throw error;
    }
}

export async function getMedicationRecord(userId) {
    try {
        const response = await axios.get(`/mobile/medication/record/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}

export async function getFamilyMedicalRecord(userId) {
    try {
        const response = await axios.get(`/mobile/family/medical/record/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}

export async function getAllHospital() {
    try {
        const response = await axios.get(`/mobile/get/all/hospital`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test results:", error);
        throw error;
    }
}