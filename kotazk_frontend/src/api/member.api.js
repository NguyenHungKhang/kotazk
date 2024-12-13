import axiosInstance from "./axios.interceptor";

const ORIGINAL_BASE_URL = `${process.env.REACT_APP_SECURE_PART_URL}/member`;

export const create = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/`, data);

export const updateStatus = async (memberId, data) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/update-status/${memberId}`, data);

export const remove = async (memberId) => await axiosInstance.delete(`${ORIGINAL_BASE_URL}/${memberId}`);

export const getCurrentOneByProject = async (projectId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/current/by-project/${projectId}`);

export const getCurrentOneByWorkspace = async (workspaceId) => await axiosInstance.get(`${ORIGINAL_BASE_URL}/current/by-workspace/${workspaceId}`);

export const inviteList = async (data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/invite-list`, data);

export const getPageByProject = async (projectId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-project/${projectId}`, data);

export const getPageByWorkspace = async (workspaceId, data) => await axiosInstance.post(`${ORIGINAL_BASE_URL}/page/by-workspace/${workspaceId}`, data);

export const getOwnInvitation = async () => await axiosInstance.get(`${ORIGINAL_BASE_URL}/own-invitation`);

export const acceptMember = async (memberId) => await axiosInstance.put(`${ORIGINAL_BASE_URL}/accept-invite/${memberId}`);