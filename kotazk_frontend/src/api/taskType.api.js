import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/taskType`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (statusId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${statusId}`, data);

export const remove = async (statusId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${statusId}`);

export const saveList = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/save-list/by-project/${projectId}`, data);

export const getPageByProject = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);
