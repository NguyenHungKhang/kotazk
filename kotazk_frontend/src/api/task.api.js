import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/task`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (taskId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${taskId}`, data);

export const remove = async (taskId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${taskId}`);

export const getOne = async (taskId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/${taskId}`);

export const getPageByProject = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);

export const getTodayTask = async (projectId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/today/by-project/${projectId}`);