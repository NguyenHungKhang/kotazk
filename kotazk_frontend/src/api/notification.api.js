import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/notification`;

export const read = async (notificationId) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${notificationId}/read`);

export const check = async () => await axiosInstance.put(`${ORIGINAL_BASE_URL}/check`);

export const getPage = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page`, data);
