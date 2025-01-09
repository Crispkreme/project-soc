import axios from "../utils/axios";

export async function getTopMedicine() {
    try {
        const response = await axios.get(`/mobile/top/medicine`);
        console.log('analytics', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}

export async function getAllMedicine() {
    try {
        const response = await axios.get(`/mobile/get/all/medicine`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}

export async function getMedicineInventory() {
    try {
        const response = await axios.get(`/mobile/get/all/medicine/inventory`);
        return response.data;
    } catch (error) {
        console.error("Error fetching medication records:", error);
        throw error;
    }
}