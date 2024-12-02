import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/activity-log`;

export const getAll = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/all`, data);
