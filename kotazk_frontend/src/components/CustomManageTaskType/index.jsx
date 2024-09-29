import { Box, Button, Card, Checkbox, Grid, IconButton, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import { useSelector } from "react-redux";
import CustomTaskType from '../CustomTaskType/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useRef, useState } from 'react';
import * as TablerIcons from '@tabler/icons-react'
import { taskTypeIconsList } from "../../utils/iconsListUtil";
import CustomBasicTextField from "../CustomBasicTextField";
import CustomColorIconPicker from "../CustomColorIconPicker";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/actions/snackbar.action";
import { setCurrentTaskTypeList } from "../../redux/actions/taskType.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import { setDeleteDialog } from "../../redux/actions/dialog.action";

// Helper function to reorder items in the array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const CustomManageTaskType = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const taskTypes = useSelector((state) => state.taskType.currentTaskTypeList);
    const project = useSelector((state) => state.project.currentProject)
    const [selectedTaskType, setSelectedTaskType] = useState(null);
    const [openAddTaskType, setOpenAddTaskType] = useState(false);
    const [items, setItems] = useState(taskTypes);
    const DragIcon = TablerIcons["IconGripVertical"];
    const EditIcon = TablerIcons["IconEdit"];

    useEffect(() => {
        if (taskTypes)
            setItems(taskTypes);
    }, [, taskTypes])

    const reorderItem = async (currentItemId, previousItemId, nextItemId) => {
        const data = {
            rePositionReq: (nextItemId == null && previousItemId == null) ? null : {
                currentItemId: currentItemId,
                nextItemId: nextItemId,
                previousItemId: previousItemId
            },
        };

        const response = await apiService.taskTypeAPI.update(currentItemId, data);
        if (response?.data) {
            const finalAr = updateAndAddArray(taskTypes, [response.data]);
            dispatch(setCurrentTaskTypeList(finalAr));
        }
    }

    const onDragEnd = (result) => {
        const { destination, source } = result;

        // If no destination, or item didn't move
        if (!destination || destination.index === source.index) {
            return;
        }

        // Reorder the items based on the drop
        const reorderedItems = reorder(items, source.index, destination.index);
        setItems(reorderedItems);

        // Get the current item (the one that was dragged and dropped)
        const currentItem = reorderedItems[destination.index];
        const currentItemId = currentItem.id;

        // Get the previous item in the new order (if any)
        const previousItem = reorderedItems[destination.index - 1];
        const previousItemId = previousItem ? previousItem.id : null;

        // Get the next item in the new order (if any)
        const nextItem = reorderedItems[destination.index + 1];
        const nextItemId = nextItem ? nextItem.id : null;

        reorderItem(currentItemId, previousItemId, nextItemId);
    };


    return (
        <Box
            bgcolor={getSecondBackgroundColor(theme)}
            p={4}
            borderRadius={4}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h5" fontWeight={500} flexGrow={1}>
                    TaskType Setting
                </Typography>
            </Stack>
            <Stack
                mt={2}
                direction="row"
                spacing={2}
                alignItems="center"
            >
                <Box flexGrow={1}>
                    <TextField
                        fullWidth
                        size="small"
                        margin="dense"
                        placeholder="Search taskType..."
                    />
                </Box>
                <Box>
                    <Button variant="contained" color="success" onClick={() => setOpenAddTaskType(true)}>
                        Add
                    </Button>
                </Box>
            </Stack>
            {openAddTaskType && <TaskTypeAddItem taskTypes={taskTypes} project={project} setOpenAddTaskType={setOpenAddTaskType} />}
            {/* DragDropContext to enable drag and drop functionality */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="taskTypes">
                    {(provided) => (
                        <Stack
                            spacing={2}
                            mt={2}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {items?.map((taskType, index) => (
                                <Draggable key={taskType.id} draggableId={taskType.id.toString()} index={index}>
                                    {(provided) => (

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems='stretch'
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}

                                        >
                                            <Card {...provided.dragHandleProps} sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <DragIcon size={20} stroke={2} />
                                            </Card>
                                            <TaskTypeListItem taskType={taskType} taskTypes={taskTypes} />
                                        </Stack>

                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Stack>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};


const TaskTypeAddItem = ({ taskTypes, project, setOpenAddTaskType }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const CancleIcon = TablerIcons["IconX"];

    const [name, setName] = useState(null);
    const [customization, setCustomization] = useState(null);
    const [isChange, setIsChange] = useState(false);

    // Ref for the component
    const wrapperRef = useRef(null);

    // Detect clicks outside of the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenAddTaskType(false); // Close the component when clicking outside
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpenAddTaskType]);

    useEffect(() => {
        setIsChange(name != null && name != "");
    }, [name]);

    const handleSaveTaskType = async () => {
        const data = {
            name,
            customization,
            projectId: project?.id
        };
        const response = await apiService.taskTypeAPI.create(data);
        if (response?.data) {
            dispatch(setCurrentTaskTypeList(updateAndAddArray(taskTypes, [response?.data])));
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update taskType successful!",
                open: true
            }));
            setOpenAddTaskType(false);
        }
    };

    return (
        <Stack
            ref={wrapperRef} // Attach the ref to the root element
            direction='row'
            spacing={2}
            border='2px dashed'
            p={2}
            borderColor={theme.palette.success.main}
        >
            <Card sx={{ py: 2, px: 4, flexGrow: 1 }}>
                <Stack
                    direction="row"
                    spacing={4}
                    alignItems='center'
                >
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorIconPicker changeable={true} icons={taskTypeIconsList} customization={customization} setCustomization={setCustomization} />
                        <CustomBasicTextField
                            size="small"
                            margin="dense"
                            defaultValue={name}
                            fullWidth
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsChange(true);
                            }}
                        />
                    </Stack>
                </Stack>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                    onClick={handleSaveTaskType}
                    disabled={!isChange}
                >
                    <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.success.main : theme.palette.grey[500]} />
                </IconButton>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => setOpenAddTaskType(false)}>
                    <CancleIcon size={20} stroke={2} color={theme.palette.error.main} />
                </IconButton>
            </Card>
        </Stack>
    );
};


const TaskTypeListItem = ({ taskType, taskTypes }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconTrashXFilled"];
    const EditIcon = TablerIcons["IconEdit"];
    const [name, setName] = useState(taskType.name);
    const [customization, setCustomization] = useState(taskType.customization);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (taskType != null) {
            setName(taskType.name);
            setCustomization(taskType.setCustomization);
        }
    }, [taskType])

    useEffect(() => {
        if (customization != null && customization != taskType.customization)
            setIsChange(true);
    }, [customization])


    const handleSaveTaskType = async () => {
        const data = {
            "name": name,
            "customization": customization
        }
        const response = await apiService.taskTypeAPI.update(taskType.id, data);
        if (response?.data) {
            dispatch(setCurrentTaskTypeList(updateAndAddArray(taskTypes, [response?.data])))
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update taskType successful!",
                open: true
            }))
        }
    }

    const handleOpenDeleteDialog = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete taskType "${name}"?`,
            content:
                `You're about to permanently delete this task type. <strong>It's task will be moved to the type "Task"</strong>.
                <br/><br/>
                If you're not sure, you can resolve or close this task type instead.`,
            open: true,
            deleteType: "DELETE_TASKTYPE",
            deleteProps: {
                taskTypeId: taskType?.id
            }
        }));
    };

    return (
        <>
            <Card
                sx={{ py: 2, px: 4, flexGrow: 1 }}
            > <Stack

                direction="row"
                spacing={4}
                alignItems='center'>
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorIconPicker changeable={true} icons={taskTypeIconsList} customization={customization} setCustomization={setCustomization} />
                        <CustomBasicTextField
                            size="small"
                            margin="dense"
                            defaultValue={name}
                            fullWidth
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsChange(true);
                            }
                            }
                        />
                    </Stack>
                </Stack>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <IconButton
                    onClick={handleSaveTaskType}
                    disabled={!isChange}
                >
                    <EditIcon size={20} stroke={2} color={isChange ? theme.palette.info.main : theme.palette.grey[500]} />
                </IconButton>
            </Card>
            {!taskType?.systemRequired &&
                <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Card>
            }
        </>
    );
}
export default CustomManageTaskType;
