import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/workspace`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const getDetailById = async (workspaceId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/detail/${workspaceId}`);

export const getPageSumary = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/summary`, data);

export const getPageDetail = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/detail`, data);