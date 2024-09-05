import Cookies from 'js-cookie'
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

const refreshToken = async () => {
    return await axios.post(process.env.REACT_APP_API_URL + "/auth/refreshtoken", {
        "token": refreshToken
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true
    });
}

axiosInstance.interceptors.request.use((req) => {
    const accessToken = Cookies.get("AUTH-TOKEN");
    if (accessToken) {
        req.headers.authorization = `Bearer ${accessToken}`;
    }
    return req;
}, function (error) {
    return Promise.reject(error);
});


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = Cookies.get("REFRESH-TOKEN");
        if (error.response?.status === 401) {
            try {
                const fecthToken = await refreshToken();
                if (fecthToken.status === 200) {
                    const newAccessToken = Cookies.get("AUTH-TOKEN");
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (e) {
                return Promise.reject(e);
            }

        }
        return Promise.reject(error);

    }
);

export default axiosInstance;