export const setProjectReports = (projectReports) => ({type: 'SET_PROJECT_REPORTS_LIST', payload: projectReports});
export const deleteProjectReport = (projectReportId) => ({type: 'DELETE_PROJECT_REPORT', payload: projectReportId});
// export const addProjectReport = (projectReport) => ({type: 'ADD_PROJECT_REPORT', payload: memberRoleList});
export const updateProjectReport = (projectReport) => ({type: 'UPDATE_PROJECT_REPORT', payload: projectReport});