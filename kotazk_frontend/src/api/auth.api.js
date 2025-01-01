import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_PUBLIC_PART_URL}/auth`;

export const login = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/login`, data);

export const logout = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/logout`, data);

export const register = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/signup`, data);

export const active = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/active`, data);

export const resend = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/resend`, data);