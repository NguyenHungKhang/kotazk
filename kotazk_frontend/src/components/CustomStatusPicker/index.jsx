import { Box, Button, ListItem, Skeleton, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomStatus from "../CustomStatus";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from "../../redux/actions/task.action";
import { setTaskDialog } from "../../redux/actions/dialog.action";

const CustomStatusPicker = ({ currentStatus, taskId }) => {
    const [statuses, setStatuses] = useState();
    const tasks = useSelector((state) => state.task.currentTaskList)
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const [status, setStatus] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentStatus != null) {
            setStatus(currentStatus);
        }
    }, [currentStatus]);

    const saveStatus = async (object) => {
        const data = {
            "statusId": object?.id,
        }

        try {
            const response = await apiService.taskAPI.update(taskId, data);
            if (response?.data) {
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(response?.data))
                else
                    dispatch(addAndUpdateTaskList(response?.data));

                const taskDialogData = {
                    task: response.data
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    return (status == null) ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomStatusOpenComponent {...props} status={status} setStatuses={setStatuses} projectId={currentStatus?.projectId} />
                )}
                selectedObject={status}
                setSelectedObject={setStatus}
                saveMethod={saveStatus}
                ItemComponent={CustomStatusItemPicker}
                objectsData={statuses}
                isNotNull={true}
            />
        </Box>
    );
}

const CustomStatusOpenComponent = ({ onClick, status, setStatuses, projectId, setTarget, isFocusing }) => {
    const theme = useTheme();
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const project = useSelector((state) => state.project.currentProject);

    const handleFecthStatus = async () => {
        try {
            const data = {
                'sortBy': 'position',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.statusAPI.getPageByProject(project?.id, data);
            if (response?.data) {
                setStatuses([...response?.data.content]);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }


    return (
        <Box
            ref={setTarget}
            onClick={() => {
                if (currentMember?.role?.projectPermissions.includes("EDIT_TASKS")) {
                    handleFecthStatus();
                    onClick();
                }
            }}
            width='100%'
            sx={{
                cursor: currentMember?.role?.projectPermissions.includes("EDIT_TASKS") ? 'pointer' : null,
                borderRadius: 2,
                py: 1,
                px: 2,
                '&:hover': {
                    bgcolor: currentMember?.role?.projectPermissions.includes("EDIT_TASKS") ? (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800]) : null,
                },
                bgcolor: (currentMember?.role?.projectPermissions.includes("EDIT_TASKS") && isFocusing) ? (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]) : null
            }}
        >
            <CustomStatus status={status} changeable={false} />
        </Box>
    )
}

const CustomStatusItemPicker = (props) => {
    const theme = useTheme();
    return (
        <ListItem
            sx={{
                py: 0,
                px: 1,
                my: 1,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                }
            }}
            onClick={() => props.onClick(props.object)}
            dense
        >
            <CustomStatus status={props.object} changeable={false} />
        </ListItem>
    )
}

export default CustomStatusPicker;