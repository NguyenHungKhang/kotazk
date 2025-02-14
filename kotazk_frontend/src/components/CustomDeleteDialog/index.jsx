import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setDeleteDialog, setTaskDialog } from '../../redux/actions/dialog.action';
import * as apiService from '../../api/index'
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList, removeItemGroupedTaskList, removeItemTaskList, setCurrentTaskList } from '../../redux/actions/task.action';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { setCurrentStatusList } from '../../redux/actions/status.action';
import { updateAndAddArray } from '../../utils/arrayUtil';
import { setCurrentTaskTypeList } from '../../redux/actions/taskType.action';
import { setCurrentPriorityList } from '../../redux/actions/priority.action';
import { setCurrentLabelList } from '../../redux/actions/label.action';
import { delteMemberRole } from '../../redux/actions/memberRole.action';
import { deleteProjectReport } from '../../redux/actions/projectReport.action';
import { removeItemTaskCommentList } from '../../redux/actions/taskComment.action';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import { useTheme } from '@mui/material';
import { setSection, setSectionList } from '../../redux/actions/section.action';
import { useNavigate } from 'react-router-dom';
import { setCurrentWorkspace } from '../../redux/actions/workspace.action';


export default function CustomDeleteDialog({ deleteAction }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { title, content, open, deleteType, deleteProps } = useSelector((state) => state.dialog.deleteDialog);
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const openTaskDialog = useSelector((state) => state.dialog.taskDialog.open);
    const tasks = useSelector((state) => state.task.currentTaskList)
    const statuses = useSelector((state) => state.status.currentStatusList)
    const taskTypes = useSelector((state) => state.taskType.currentTaskTypeList)
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const labels = useSelector((state) => state.label.currentLabelList);
    const sections = useSelector((state) => state.section.currentSectionList);
    const project = useSelector((state) => state.project.currentProject);
    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(setDeleteDialog({ open: false }));
    };

    const handleDeleteAction = async () => {
        if (deleteType == "DELETE_TASK" && deleteProps != null) {
            const taskId = deleteProps.taskId;
            await handleDelete(taskId)
        } else if (deleteType == "DELETE_SUBTASK" && deleteProps != null) {
            const taskId = deleteProps.taskId;
            const parentTask = deleteProps.parentTask;
            await handleDeleteSubtask(parentTask, taskId)
        } else if (deleteType == "DELETE_STATUS" && deleteProps != null) {
            const statusId = deleteProps.statusId;
            await handleDeleteStatus(statusId)
        } else if (deleteType == "DELETE_TASKTYPE" && deleteProps != null) {
            const taskTypeId = deleteProps.taskTypeId;
            await handleDeleteTaskType(taskTypeId)
        } else if (deleteType == "DELETE_PRIORITY" && deleteProps != null) {
            const priorityId = deleteProps.priorityId;
            await handleDeletePriority(priorityId)
        } else if (deleteType == "DELETE_LABEL" && deleteProps != null) {
            const labelId = deleteProps.labelId;
            await handleDeleteLabel(labelId);
        } else if (deleteType == "DELETE_TASK_ATTACHMENT" && deleteProps != null) {
            const attachmentId = deleteProps.attachmentId;
            const task = deleteProps.task;
            await handleDeleteAttachment(attachmentId, task)
        } else if (deleteType == "DELETE_MEMBER" && deleteProps != null) {
            const memberId = deleteProps.memberId;
            await handleDeleteMmber(memberId);
        } else if (deleteType == "DELETE_ROLE" && deleteProps != null) {
            const roleId = deleteProps.roleId;
            await handleDeleteMemberRole(roleId);
        } else if (deleteType == "DELETE_PROJECT_REPORT" && deleteProps != null) {
            const projectReportId = deleteProps.projectReportId;
            await handleDeleteProjectReport(projectReportId);
        } else if (deleteType == "DELETE_TASK_COMMENT" && deleteProps != null) {
            const taskCommentId = deleteProps.taskCommentId;
            await handleDeleteTaskComment(taskCommentId);
        } else if (deleteType == "DELETE_SECTION" && deleteProps != null) {
            const sectionId = deleteProps.sectionId;
            await handleDeleteSection(sectionId);
        } else if (deleteType == "DELETE_WORKSPACE" && deleteProps != null) {
            const workspaceId = deleteProps.workspaceId;
            await handleDeleteWorkspace(workspaceId);
        }
        dispatch(setDeleteDialog({ open: false }));
    }


    const handleDelete = async (taskId) => {
        try {
            const response = await apiService.taskAPI.remove(taskId)
            if (response?.data) {
                if (isGroupedList)
                    dispatch(removeItemGroupedTaskList(taskId))
                else
                    dispatch(removeItemTaskList(taskId));

                dispatch(setSnackbar({
                    content: "Task deleted successful!",
                    type: "success",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }

    }

    const handleDeleteSubtask = async (parentTask, taskId) => {
        try {
            const response = await apiService.taskAPI.remove(taskId)
            if (response?.data) {
                const updatedParentTask = {
                    ...parentTask,
                    childTasks: parentTask.childTasks.filter(t => t.id != taskId)
                }

                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(updatedParentTask))
                else
                    dispatch(addAndUpdateTaskList(updatedParentTask));

                if (openTaskDialog) {
                    const taskDialogData = {
                        task: updatedParentTask
                    };
                    dispatch(setTaskDialog(taskDialogData));
                }

                dispatch(setSnackbar({
                    content: "Subtask deleted successful!",
                    type: "success",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }

    }


    const handleDeleteStatus = async (statusId) => {
        try {
            const response = await apiService.statusAPI.remove(statusId)
            if (response?.data) {
                tasks.forEach(task => {
                    const matchingUpdate = response?.data.find(updateTask => updateTask.id === task.id);
                    if (matchingUpdate) {
                        task.statusId = matchingUpdate.statusId;
                    }
                });
                await dispatch(setCurrentTaskList(tasks))
                await dispatch(setCurrentStatusList(statuses.filter(s => s.id != statusId)));
                await dispatch(setSnackbar({
                    content: "Status deleted successful!",
                    type: "success",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to deleted status:', error);
        }
    }


    const handleDeleteTaskType = async (taskTypeId) => {
        try {
            const response = await apiService.taskTypeAPI.remove(taskTypeId)
            if (response?.data) {
                tasks.forEach(task => {
                    const matchingUpdate = response?.data.find(updateTask => updateTask.id === task.id);
                    if (matchingUpdate) {
                        task.taskTypeId = matchingUpdate.taskTypeId;
                    }
                });
                await dispatch(setCurrentTaskList(tasks))
                await dispatch(setCurrentTaskTypeList(taskTypes.filter(tt => tt.id != taskTypeId)));
                await dispatch(setSnackbar({
                    content: "Task type deleted successful!",
                    type: "success",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to deleted task type:', error);
        }
    }

    const handleDeletePriority = async (priorityId) => {
        try {
            const response = await apiService.priorityAPI.remove(priorityId);
            if (response?.data) {
                const updatedTasks = tasks.map(task => {
                    const matchingUpdate = response?.data.find(updateTaskId => updateTaskId == task.id);
                    if (matchingUpdate) {
                        return { ...task, priorityId: null };
                    }
                    return task;
                });

                const updatedPriorities = priorities.filter(p => p.id != priorityId);

                dispatch(setCurrentTaskList(updatedTasks));
                dispatch(setCurrentPriorityList(updatedPriorities));
                dispatch(setSnackbar({
                    content: "Priority deleted successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete priority:', error);
        }
    };

    const handleDeleteLabel = async (labelId) => {
        try {
            const response = await apiService.labelAPI.remove(labelId);
            if (response?.data) {
                const updatedTasks = tasks.map(task => {
                    const updatedLabels = task.labels.filter(label => label.labelId !== labelId);
                    return { ...task, labels: updatedLabels };
                });

                const updatedLabels = labels.filter(l => l.id !== labelId);

                dispatch(setCurrentTaskList(updatedTasks));
                dispatch(setCurrentLabelList(updatedLabels));
                dispatch(setSnackbar({
                    content: "Label deleted successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete label:', error);
        }
    };

    const handleDeleteAttachment = async (attachmentId, task) => {
        try {
            const response = await apiService.attachmentAPI.remove(attachmentId); // Use taskId for deletion
            if (response?.data) {
                const updatedTask = {
                    ...task,
                    attachments: task?.attachments?.filter(t => t.id != attachmentId)
                }

                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(updatedTask))
                else
                    dispatch(addAndUpdateTaskList(updatedTask));

                const taskDialogData = {
                    task: updatedTask
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch {
            console.error('Failed to delete file');
        }
    };


    const handleDeleteMmber = async (memberId) => {
        try {
            const response = await apiService.memberAPI.remove(memberId);
            if (response?.data) {

                dispatch(setSnackbar({
                    content: "Member deleted successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete member:', error);
        }
    };

    const handleDeleteMemberRole = async (roleId) => {
        try {
            const response = await apiService.memberRoleAPI.remove(roleId);
            if (response?.data) {
                dispatch(delteMemberRole(roleId));
                dispatch(setSnackbar({
                    content: "Member role delete successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete member role:', error);
        }
    };

    const handleDeleteProjectReport = async (projectReportId) => {
        try {
            const response = await apiService.projectReport.remove(projectReportId);
            if (response?.data) {
                dispatch(deleteProjectReport(projectReportId));
                dispatch(setSnackbar({
                    content: "Project report role delete successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete project report:', error);
        }
    };


    const handleDeleteTaskComment = async (taskCommentId) => {
        try {
            const response = await apiService.taskComment.remove(taskCommentId);
            if (response?.data) {
                dispatch(removeItemTaskCommentList(taskCommentId));
                dispatch(setSnackbar({
                    content: "Task comment delete successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete task comment:', error);
        }
    };


    const handleDeleteSection = async (sectionId) => {
        try {
            const index = sections.findIndex(s => s.id == sectionId);
            if (index > 0) {
                setSection(sections[index - 1]);
                navigate(`/project/${project?.id}/section/${sections[index - 1].id}`)
            } else if (index == 0) {
                if (sections.length > 1) {
                    setSection(sections[1]);
                    navigate(`/project/${project?.id}/section/${sections[1].id}`)
                } else {
                    setSection(null);
                    navigate(`/project/${project?.id}`)
                }
            }

            const response = await apiService.sectionAPI.remove(sectionId);
            if (response?.data) {
                const finalSections = sections.filter(s => s.id != sectionId);
                dispatch(setSectionList(finalSections))
                dispatch(setSnackbar({
                    content: "Section delete successfully!",
                    type: "success",
                    open: true
                }));
            }
        } catch (error) {
            console.error('Failed to delete section:', error);
        }
    };

    const handleDeleteWorkspace = async (workspaceId) => {
        try {
            const response = await apiService.workspaceAPI.remove(workspaceId);
            if (response?.data) {

                dispatch(setSnackbar({
                    content: "Workspace delete successfully!",
                    type: "success",
                    open: true
                }));
                navigate(`/workspace`)
                dispatch(setCurrentWorkspace(null));
            }
        } catch (error) {
            console.error('Failed to delete workspace:', error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <p dangerouslySetInnerHTML={{ __html: content }}></p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteAction} variant='contained' color='error'>Delete</Button>
                <Button onClick={handleClose} autoFocus variant='contained' color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}>
                    Cancle
                </Button>
            </DialogActions>
        </Dialog>
    );
}
