import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/task-comment`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (taskCommentId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${taskCommentId}`, data);

export const remove = async (taskCommentId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${taskCommentId}`);

export const getPageByTask = async (taskId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-task/${taskId}`, data);