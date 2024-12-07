import Cookies from 'js-cookie';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Function to refresh the token
const fetchNewToken = async () => {
    const refreshToken = Cookies.get("REFRESH-TOKEN");
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/refreshtoken`,
        { token: refreshToken },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data; // Assuming the API returns new tokens
};

// Request interceptor to add authorization header
axiosInstance.interceptors.request.use(
    (req) => {
        const accessToken = Cookies.get("AUTH-TOKEN");
        if (accessToken) {
            req.headers.authorization = `Bearer ${accessToken}`;
        }
        return req;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors and refreshing token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loops
            try {
                const tokenData = await fetchNewToken();
                Cookies.set("AUTH-TOKEN", tokenData.accessToken, { secure: true }); // Update token in cookies
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${tokenData.accessToken}`;
                return axiosInstance(originalRequest); // Retry original request
            } catch (e) {
                console.error("Token refresh failed", e);
                return Promise.reject(e); // Reject the error if refresh fails
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
