import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/section`;

export const add  = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update  = async (sectionId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${sectionId}`, data);

export const getOne = async (sectionId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/${sectionId}`);

export const getPageByProject = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);