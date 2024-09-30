import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/priority`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (priorityId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${priorityId}`, data);

export const remove = async (priorityId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${priorityId}`);

export const getPageByProject = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);
