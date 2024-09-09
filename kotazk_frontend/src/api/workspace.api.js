import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/workspace`;

export const getDetailById = async (workspaceId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/detail/${workspaceId}`);