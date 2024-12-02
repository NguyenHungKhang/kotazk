import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/user`;

export const getOneByEmail = async (email) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/by-email?email=${email}`);

export const getCurrentOne = async (email) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/current`);

