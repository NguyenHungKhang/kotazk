import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_PUBLIC_PART_URL}/auth`;

export const login = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/login`, data);