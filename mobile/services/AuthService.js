import axios from "../utils/axios";
import { setToken, getToken } from "../services/TokenService";

export async function login(credentials) {
    const { data } = await axios.post('/mobile/login', credentials);
    await setToken(data.token);
}

export async function loadUser() {
    const token = await getToken();
    
    const {data : user} = await axios.get('/user', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return user;
}

export async function storeUserDetails(data) {
    
    try {
        const response = await axios.post(`/mobile/store/user`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing storeUserDetails:", error);
        throw error;
    }
}

export async function updateUserDetails(data) {
    
    try {
        const response = await axios.post(`/mobile/update/user/detail`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing updateUserDetailss:", error);
        throw error;
    }
}

export async function updateUserEmail(data) {
    try {
        const response = await axios.post(`/mobile/update/user/email`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing updateUserEmail:", error);
        throw error;
    }
}

export async function updateUserPassword(data) {
    try {
        const response = await axios.post(`/mobile/update/user/password`, data);
        return response.data;
    } catch (error) {
        console.error("Error storing updateUserEmail:", error);
        throw error;
    }
}

export async function deactivateUser(id) {
    try {
        const response = await axios.post(`/mobile/deactivate/user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error storing updateUserEmail:", error);
        throw error;
    }
}

export async function getUserDetails(id) {
    try {
      const response = await axios.get(`/mobile/get/user/detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
}