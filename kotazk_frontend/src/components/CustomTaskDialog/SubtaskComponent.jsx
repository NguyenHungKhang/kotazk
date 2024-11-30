import { Avatar, Box, Button, Card, IconButton, LinearProgress, Stack, Typography, useTheme } from "@mui/material"
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import * as TablerIcons from '@tabler/icons-react'
import CustomBasicTextField from "../CustomBasicTextField";
import { useState } from "react";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from "../../redux/actions/task.action";
import { setTaskDialog } from "../../redux/actions/dialog.action";
import { useSelector } from "react-redux";
import SubtaskMenu from "./SubtaskMenu";

const SubtaskComponent = ({ subtasks, parentTask, projectId }) => {
    const theme = useTheme();
    const [addNewTask, setAddNewTask] = useState(false);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const calcProgessValue = () => {
        const completedTasks = parentTask?.childTasks?.filter(t => t.isCompleted == true).length;
        const totalTasks = parentTask?.childTasks?.length
        return 100 * (completedTasks / totalTasks);
    }

    const completedTasks = () => {
        const completedTasks = parentTask?.childTasks?.filter(t => t.isCompleted == true).length;
        const totalTasks = parentTask?.childTasks?.length
        return completedTasks + `/` + totalTasks;
    }

    return (
        <>
            {
                subtasks?.length > 0 && (
                    <Box
                        mb={2}
                        bgcolor={getSecondBackgroundColor(theme)}
                        borderRadius={2}
                        p={2}
                    >
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Box>
                                <Typography>
                                    {completedTasks()} - {calcProgessValue().toFixed(2) + '%'}
                                </Typography>
                            </Box>
                            <Box flexGrow={1}>
                                <LinearProgress
                                    variant="determinate"
                                    value={calcProgessValue()}
                                    sx={{
                                        height: 10,
                                        borderRadius: 2
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Box>
                )
            }

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
                        <AddSubtaskItem setIsNewSubtask={setAddNewTask} parentTask={parentTask} projectId={projectId} />
                        :
                        <Button
                            onClick={() => {
                                if (currentMember?.role?.projectPermissions.includes("EDIT_TASKS"))
                                    setAddNewTask(true)
                            }}
                            variant='text'
                            size="small"
                            color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                        >
                            Add subtask
                        </Button>
                    }

                </Stack>
            </Box>
        </>
    )
}




const AddSubtaskItem = ({ setIsNewSubtask, parentTask, projectId }) => {
    const theme = useTheme();
    const [name, setName] = useState(null);
    const dispatch = useDispatch();
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const DragIcon = TablerIcons["IconGripVertical"];
    const DashedOutlinedCheckCircleIcon = TablerIcons["IconCircleDashedCheck"];
    const FilledCheckCircleIcon = TablerIcons["IconCircleCheckFilled"];



    const handleSave = async () => {
        if (name == null || name.trim() == "") {
            setIsNewSubtask(false)
        } else {
            const data = {
                'name': name,
                'parentTaskId': parentTask?.id,
                'projectId': projectId
            }
            try {
                const response = await apiService.taskAPI.create(data);
                if (response?.data) {
                    const updatedParentTask = {
                        ...parentTask,
                        childTasks: [...parentTask.childTasks, response?.data]
                    }

                    if (isGroupedList)
                        dispatch(addAndUpdateGroupedTaskList(updatedParentTask))
                    else
                        dispatch(addAndUpdateTaskList(updatedParentTask));

                    const taskDialogData = {
                        task: updatedParentTask
                    };
                    dispatch(setTaskDialog(taskDialogData));
                    setIsNewSubtask(false);
                }
            } catch (error) {
                console.error('Failed to update task:', error);
            }
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
                <Box>
                    <Typography>
                        New subtask:
                    </Typography>
                </Box>
                <Box flexGrow={1}>
                    <CustomBasicTextField
                        size="small"
                        autoFocus
                        placeholder="Name of task..."
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleSave()}
                        sx={{
                            '& .MuiInputBase-input': {
                                py: `4px !important`,
                            }
                        }}
                        fullWidth
                    />
                </Box>
            </Stack>
        </Card>
    )
}

const SubtaskItem = ({ subtask, parentTask, projectId }) => {
    const theme = useTheme();
    const [name, setName] = useState(null);
    const dispatch = useDispatch();
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const DragIcon = TablerIcons["IconGripVertical"];
    const DashedOutlinedCheckCircleIcon = TablerIcons["IconCircleDashedCheck"];
    const FilledCheckCircleIcon = TablerIcons["IconCircleCheckFilled"];
    const OpenIcon = TablerIcons["IconArrowsMaximize"];
    const MoreIcon = TablerIcons["IconDots"]

    const handleAccessChildrenTask = async () => {
        const response = await apiService.taskAPI.getOne(subtask?.id)
        if (response?.data) {
            const data = {
                task: response?.data,
                open: true
            }
            dispatch(setTaskDialog(data));
        }
    }

    const handleSaveName = async () => {
        const data = {
            'name': name,
        }
        try {
            const response = await apiService.taskAPI.update(subtask?.id, data);
            if (response?.data) {
                const updatedParentTask = {
                    ...parentTask,
                    childTasks: parentTask.childTasks.map(task => task.id === subtask.id ?
                        {
                            ...task,
                            name: response?.data?.name,
                        }
                        : task
                    )
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
        if (currentMember?.role?.projectPermissions.includes("EDIT_TASKS")) {
            const data = {
                'isCompleted': !subtask?.isCompleted,
            }
            try {
                const response = await apiService.taskAPI.update(subtask?.id, data);
                if (response?.data) {
                    const updatedParentTask = {
                        ...parentTask,
                        childTasks: parentTask.childTasks.map(task => task.id === subtask.id ?
                            {
                                ...task,
                                isCompleted: response?.data?.isCompleted,
                            }
                            : task
                        )
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
                <IconButton
                    size="small"
                    onClick={() => handleCompleteTask()}
                >
                    {subtask?.isCompleted ? <FilledCheckCircleIcon size={18} color={theme.palette.success.main} /> : <DashedOutlinedCheckCircleIcon size={18} />}
                </IconButton>
                <IconButton
                    onClick={() => handleAccessChildrenTask()}
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
                        slotProps={{
                            input: {
                                readOnly: !currentMember?.role?.projectPermissions.includes("EDIT_TASKS")
                            }
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                py: `4px !important`,
                            }
                        }}
                        fullWidth
                    />
                </Box>
                <Box>
                    <SubtaskMenu parentTask={parentTask} task={subtask} />
                </Box>
            </Stack>
        </Card>
    )
}

export default SubtaskComponent;