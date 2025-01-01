import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/user`;

export const getOneByEmail = async (email) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/by-email?email=${email}`);

export const getCurrentOne = async (email) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/current`);

export const update = async (data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/`, data);

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.put(`${ORIGINAL_BASE_URL}/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
