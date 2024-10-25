import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/member`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (memberId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${memberId}`, data);

export const remove = async (memberId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${memberId}`);

export const getPageByProject = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);
