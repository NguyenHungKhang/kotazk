import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/workspace`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (workspaceId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${workspaceId}`, data);

export const remove = async (workspaceId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${workspaceId}`);

export const getDetailById = async (workspaceId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/detail/${workspaceId}`);

export const getPageSumary = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/summary`, data);

export const getPageDetail = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/detail`, data);

export const uploadCover = async (file, workspaceId) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.put(`${ORIGINAL_BASE_URL}/upload-cover/${workspaceId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
