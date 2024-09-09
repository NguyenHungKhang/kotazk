import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/project`;

export const pageByWorkspace = async (workspaceId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-work-space/${workspaceId}`, data);

export const getById = async (projectId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/${projectId}`);

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);