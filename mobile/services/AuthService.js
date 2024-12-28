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