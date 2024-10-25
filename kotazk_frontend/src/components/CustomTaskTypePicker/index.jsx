import { Box, Button, ListItem, Skeleton, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomTaskType from "../CustomTaskType";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";

const CustomTaskTypePicker = ({ currentTaskType, taskId }) => {
    const [taskTypes, setTaskTypes] = useState();
    const tasks = useSelector((state) => state.task.currentTaskList)
    const [taskType, setTaskType] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentTaskType != null) {
            setTaskType(currentTaskType);
        }
    }, [currentTaskType]);

    useEffect(() => {
        if (currentTaskType != null)
            listTaskTypeFetch()
    }, [currentTaskType?.projectId])

    const listTaskTypeFetch = async () => {
        try {
            const data = {
                'sortBy': 'position',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.taskTypeAPI.getPageByProject(currentTaskType?.projectId, data);
            if (response?.data) {
                setTaskTypes(response?.data.content);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    const saveTaskType = async (object) => {
        const data = {
            "taskTypeId": object?.id,
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

    return (taskType == null || taskTypes == null) ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomTaskTypeOpenComponent {...props} taskType={taskType} />
                )}
                selectedObject={taskType}
                setSelectedObject={setTaskType}
                saveMethod={saveTaskType}
                ItemComponent={CustomTaskTypeItemPicker}
                objectsData={taskTypes}
                isNotNull={true}
            />
        </Box>
    );
}

const CustomTaskTypeOpenComponent = ({ onClick, taskType, isFocusing }) => {
    const theme = useTheme();
    return (
        <Box
            onClick={onClick}
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
            <CustomTaskType taskType={taskType} changeable={false} />
        </Box>
    )
}

const CustomTaskTypeItemPicker = (props) => {
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
            <CustomTaskType taskType={props.object} changeable={false} />
        </ListItem>
    )
}

export default CustomTaskTypePicker;