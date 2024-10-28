import { Box, Button, ListItem, Skeleton, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomStatus from "../CustomStatus";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import { setTaskDialog } from "../../redux/actions/dialog.action";

const CustomStatusPicker = ({ currentStatus, taskId }) => {
    const [statuses, setStatuses] = useState();
    const tasks = useSelector((state) => state.task.currentTaskList)
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
                dispatch(setCurrentTaskList(updateAndAddArray(tasks, [response.data])));
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

    const handleFecthStatus = async () => {
        try {
            const data = {
                'sortBy': 'position',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.statusAPI.getPageByProject(projectId, data);
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
                handleFecthStatus();
                onClick();
            }}
            width='100%'
            sx={{
                cursor: 'pointer',
                borderRadius: 2,
                py: 1,
                px: 2,
                '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
                },
                bgcolor: isFocusing ? (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]) : null
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