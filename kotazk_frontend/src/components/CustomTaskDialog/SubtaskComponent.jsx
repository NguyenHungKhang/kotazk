import { Avatar, Box, Button, Card, IconButton, Stack, Typography, useTheme } from "@mui/material"
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import * as TablerIcons from '@tabler/icons-react'
import CustomBasicTextField from "../CustomBasicTextField";
import { useState } from "react";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from "../../redux/actions/task.action";
import { setTaskDialog } from "../../redux/actions/dialog.action";
import { useSelector } from "react-redux";

const SubtaskComponent = ({ subtasks, parentTask, projectId }) => {
    const theme = useTheme();
    const [addNewTask, setAddNewTask] = useState(false);

    return (
        <Box
            bgcolor={getSecondBackgroundColor(theme)}
            borderRadius={2}
            p={2}
        >
            <Stack direction={'column'} spacing={1}>
                {subtasks?.map((subtask, index) => (
                    <SubtaskItem key={index} subtask={subtask} parentTask={parentTask} />
                ))}

                {addNewTask ?
                    <AddSubtaskItem setIsNewSubtask={setAddNewTask} parentTaskId={parentTask?.id} projectId={projectId} />
                    :
                    <Button
                        onClick={() => setAddNewTask(true)}
                        variant='text'
                        size="small"
                        color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    >
                        Add subtask
                    </Button>
                }

            </Stack>
        </Box>
    )
}




const AddSubtaskItem = ({ setIsNewSubtask, parentTaskId, projectId }) => {
    const theme = useTheme();
    const [name, setName] = useState(null);
    const dispatch = useDispatch();
    const isGroupedList = useSelector((state) => state.task.isGroupedList);

    const DragIcon = TablerIcons["IconGripVertical"];
    const DashedOutlinedCheckCircleIcon = TablerIcons["IconCircleDashedCheck"];
    const FilledCheckCircleIcon = TablerIcons["IconCircleCheckFilled"];

    const handleSave = async () => {
        const data = {
            'name': name,
            'parentTaskId': parentTaskId,
            'projectId': projectId
        }
        try {
            const response = await apiService.taskAPI.create(data);
            if (response?.data) {
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(response?.data))
                else
                    dispatch(addAndUpdateTaskList(response?.data));

                const taskDialogData = {
                    task: response.data.parent
                };
                dispatch(setTaskDialog(taskDialogData));
                setIsNewSubtask(false);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    return (
        <Card
            sx={{
                p: 2,
                boxShadow: 0
            }}
        >
            <Stack direction={'row'} spacing={1} alignItems={'center'} width={'100%'}>
                <DragIcon size={18} />
                <IconButton size="small">
                    <DashedOutlinedCheckCircleIcon size={18} />
                </IconButton>
                <Box flexGrow={1}>
                    <CustomBasicTextField
                        size="small"
                        focused
                        placeholder="Name of task..."
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            '& .MuiInputBase-input': {
                                py: `4px !important`,
                            }
                        }}
                    />
                </Box>
                <Button onClick={() => handleSave()}>
                    Save task
                </Button>
                <Avatar
                    alt="Unassigned"
                    sx={{
                        alignSelf: 'flex-end',
                        width: 24,
                        height: 24,
                        border: "2px dotted",
                        borderColor: theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400],
                    }}
                />
            </Stack>
        </Card>
    )
}

const SubtaskItem = ({ subtask, parentTask, projectId }) => {
    const theme = useTheme();
    const [name, setName] = useState(null);
    const dispatch = useDispatch();
    const isGroupedList = useSelector((state) => state.task.isGroupedList);

    const DragIcon = TablerIcons["IconGripVertical"];
    const DashedOutlinedCheckCircleIcon = TablerIcons["IconCircleDashedCheck"];
    const FilledCheckCircleIcon = TablerIcons["IconCircleCheckFilled"];
    const OpenIcon = TablerIcons["IconArrowsMaximize"];
    const MoreIcon = TablerIcons["IconDots"]

    const handleAccessChildTask = () => {
        const taskDialogData = {
            task: subtask,
            parentTask: parentTask,
            open: true
        };
        dispatch(setTaskDialog(taskDialogData));
    }

    const handleSaveName = async () => {
        const data = {
            'name': name,
        }
        try {
            const response = await apiService.taskAPI.update(parentTask?.id, data);
            if (response?.data) {
                const updatedParentTask = {
                    ...parentTask,
                    childTasks: parentTask.childTasks.map(task => task.id === subtask.id ? response?.data : task)
                }
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(updatedParentTask))
                else
                    dispatch(addAndUpdateTaskList(updatedParentTask));

                const taskDialogData = {
                    task: updatedParentTask
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    const handleCompleteTask = async () => {
        const data = {
            'isCompleted': !subtask?.isCompleted,
        }
        try {
            const response = await apiService.taskAPI.update(parentTask?.id, data);
            if (response?.data) {
                const updatedParentTask = {
                    ...parentTask,
                    childTasks: parentTask.childTasks.map(task => task.id === subtask.id ? response?.data : task)
                }
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(updatedParentTask))
                else
                    dispatch(addAndUpdateTaskList(updatedParentTask));

                const taskDialogData = {
                    task: updatedParentTask
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    // const handleSave = async () => {
    //     const data = {
    //         'name': name,
    //         'parentTaskId': parentTaskId,
    //         'projectId': projectId
    //     }
    //     if (isNewSubtask) {
    //         try {
    //             const response = await apiService.taskAPI.create(data);
    //             if (response?.data) {
    //                 if (isGroupedList)
    //                     dispatch(addAndUpdateGroupedTaskList(response?.data))
    //                 else
    //                     dispatch(addAndUpdateTaskList(response?.data));

    //                 const taskDialogData = {
    //                     task: response.data.parent
    //                 };
    //                 dispatch(setTaskDialog(taskDialogData));
    //                 setIsNewSubtask(false);
    //             }
    //         } catch (error) {
    //             console.error('Failed to update task:', error);
    //         }
    //     }
    // }

    return (
        <Card
            sx={{
                p: 2,
                boxShadow: 0
            }}
        >
            <Stack direction={'row'} spacing={1} alignItems={'center'} width={'100%'}>
                <DragIcon size={18} />
                <IconButton
                    size="small"
                    onClick={() => handleCompleteTask()}
                >
                    {subtask?.isCompleted ? <FilledCheckCircleIcon size={18} color={theme.palette.success.main} /> : <DashedOutlinedCheckCircleIcon size={18} />}
                </IconButton>
                <IconButton
                    onClick={() => handleAccessChildTask()}
                    size="small"
                >
                    <OpenIcon size={18} />
                </IconButton>

                <Box flexGrow={1} pr={20}>
                    <CustomBasicTextField
                        size="small"
                        defaultValue={subtask?.name}
                        placeholder="Name of task..."
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleSaveName()}
                        sx={{
                            '& .MuiInputBase-input': {
                                py: `4px !important`,
                            }
                        }}
                        fullWidth
                    />
                </Box>
                <IconButton size="small">
                    <MoreIcon size={18} />
                </IconButton>
            </Stack>
        </Card>
    )
}

export default SubtaskComponent;