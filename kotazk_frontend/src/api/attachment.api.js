import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/attachment`;

export const createForTask = async (taskId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post(`${ORIGINAL_BASE_URL}/for-task/${taskId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};


export const remove = async (attachmentId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${attachmentId}`);
