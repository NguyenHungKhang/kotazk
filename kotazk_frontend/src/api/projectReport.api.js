import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/project-report`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const update = async (projectReportId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/${projectReportId}`, data);

export const remove = async (projectReportId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${projectReportId}`);

export const reposition = async (sectionId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/reposition-by-section/${sectionId}`, data);

// export const getOne = async (projectId) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);

export const getPreviewChart = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/preview`, data);
export const getPageBySection = async (sectionId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-section/${sectionId}`, data);
