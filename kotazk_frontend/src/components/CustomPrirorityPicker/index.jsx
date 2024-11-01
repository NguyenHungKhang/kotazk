import { Box, Button, ListItem, Typography, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomPriority from "../CustomPriority";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from "../../redux/actions/task.action";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";

const CustomPriorityPicker = ({ currentPriority, taskId }) => {
    const project = useSelector((state) => state.project.currentProject);
    const [priorities, stPriorities] = useState(null);
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const [priority, setPriority] = useState(currentPriority ? currentPriority : null);
    const dispatch = useDispatch();

    useEffect(() => {
        setPriority(currentPriority)
    }, [currentPriority]);

    const savePriority = async (object) => {
        const data = {
            "priorityId": object ? object.id : 0,
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

    return (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomPriorityOpenComponent {...props} priority={priority} stPriorities={stPriorities} projectId={project?.id} />
                )}
                selectedObject={priority}
                setSelectedObject={setPriority}
                saveMethod={savePriority}
                ItemComponent={CustomPriorityItemPicker}
                objectsData={priorities}
                isNotNull={false}
            />
        </Box>
    );
}

const CustomPriorityOpenComponent = ({ onClick, priority, stPriorities, projectId, setTarget, isFocusing }) => {
    const theme = useTheme();

    const listPrioritiesFetch = async () => {
        try {
            const data = {
                'sortBy': 'position',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.priorityAPI.getPageByProject(projectId, data);
            if (response?.data) {
                stPriorities(response?.data.content);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }


    return (
        <Box
            ref={setTarget}
            onClick={() => {
                listPrioritiesFetch();
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
            {priority != null ?
                <Box width='fit-content'>
                    <CustomPriority priority={priority} changeable={false} />
                </Box>
                :
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        px: 2,
                    }}
                >
                    <Typography variant='body2'>Empty</Typography>
                </Box>
            }
        </Box>
    )
}

const CustomPriorityItemPicker = (props) => {
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
            <CustomPriority priority={props.object} changeable={false} />
        </ListItem>
    )
}

export default CustomPriorityPicker;