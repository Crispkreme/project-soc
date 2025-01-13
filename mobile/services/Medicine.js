import axios from "../utils/axios";

export async function getTopMedicine() {
    try {
        const response = await axios.get(`/mobile/top/medicine`);
        console.log('analytics', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching getTopMedicine:", error);
        throw error;
    }
}

export async function getAllMedicine() {
    try {
        const response = await axios.get(`/mobile/get/all/medicine`);
        return response.data;
    } catch (error) {
        console.error("Error fetching getAllMedicine:", error);
        throw error;
    }
}

export async function getMedicineInventory() {
    try {
        const response = await axios.get(`/mobile/get/all/medicine/inventory`);
        return response.data;
    } catch (error) {
        console.error("Error fetching getMedicineInventory:", error);
        throw error;
    }
}

export async function searchMedicine(query) {
    try {
        const response = await axios.get(`/mobile/search/medicine/${query}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching searchMedicine:", error);
        throw error;
    }
}
