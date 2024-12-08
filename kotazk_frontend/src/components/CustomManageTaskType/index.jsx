import { Box, Button, Card, Checkbox, Grid, IconButton, Paper, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
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

const CustomManageTaskType = ({ handleClose, isDialog }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const [newTaskTypeNumber, setNewTaskTypeNumbeer] = useState(0);
    const [selectedTaskType, setSelectedTaskType] = useState(null);
    const [openAddTaskType, setOpenAddTaskType] = useState(false);
    const [items, setItems] = useState(null);
    const DragIcon = TablerIcons["IconGripVertical"];
    const EditIcon = TablerIcons["IconEdit"];
    const AddIcon = TablerIcons["IconPlus"];
    const CloseIcon = TablerIcons["IconX"];
    const [isChange, setIsChange] = useState(false);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const manageTaskTypePermission = currentMember?.role?.projectPermissions?.includes("MANAGE_TASK_TYPE");

    useEffect(() => {
        if (project)
            fetchStatus();
    }, [project])

    const fetchStatus = async () => {
        const data = {
            'sortBy': 'position',
            'sortDirectionAsc': true,
            "filters": []
        }

        const response = await apiService.taskTypeAPI.getPageByProject(project.id, data)
        if (response?.data) {
            setItems(response?.data?.content)
        }
    }

    const addNewItem = () => {
        const newItem = {
            "id": `newTaskType-${newTaskTypeNumber}`,
            "projectId": project?.id,
            "name": `Task type ${items.length + 1}`,
            "systemRequired": false,
            "customization": {
                "backgroundColor": "#0d9af2",
                "icon": "IconCircleDot"
            }
        }
        setItems(prev => [...prev, newItem]);
        setNewTaskTypeNumbeer(prev => prev + 1);
        setIsChange(true);
    }


    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        const reorderedItems = reorder(items, source.index, destination.index);
        setItems(reorderedItems);
        setIsChange(true);
    };

    const handleSave = async () => {
        const data = items.map((item) => {
            if (item.id.toString().startsWith("newTaskType-")) {
                const { id, ...rest } = item;
                return rest;
            }
            return item;
        });
        const response = await apiService.taskTypeAPI.saveList(project?.id, data);
        if (response?.data) {
            setItems(response.data);
            dispatch(setSnackbar({
                content: "Update taskType successful!",
                open: true
            }));
        }
        setIsChange(false);
    }

    return (
        <Card
            sx={{
                p: 4
            }}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h6" fontWeight={500} flexGrow={1}>
                    Task type Setting
                </Typography>
                {
                    isDialog && (
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon size={18} stroke={2} />
                            </IconButton>
                        </Box>
                    )
                }

            </Stack>
            <Stack
                my={2}
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
            </Stack>
            {/* DragDropContext to enable drag and drop functionality */}
            <Box
                sx={{
                    p: 2
                }}
            >
                <Typography
                    sx={{
                        mb: 2
                    }}
                >
                    Options
                </Typography>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="taskTypes">
                        {(provided) => (
                            <Stack
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {items?.map((taskType, index) => (
                                    <Draggable isDragDisabled={!manageTaskTypePermission} key={taskType.id} draggableId={taskType.id.toString()} index={index}>
                                        {(provided, snapshot) => (

                                            <Paper
                                                sx={{
                                                    boxShadow: 0,
                                                    borderRadius: 0,
                                                    borderTop: "1px solid",
                                                    borderBottom: snapshot.isDragging || index === items.length - 1 ? "1px solid" : 0,
                                                    borderColor: snapshot.isDragging ? getCustomTwoModeColor(theme, theme.palette.grey[500], theme.palette.grey[600]) : getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])
                                                }}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems='stretch'
                                                >
                                                    {manageTaskTypePermission && (
                                                        <Box {...provided.dragHandleProps} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <DragIcon size={20} stroke={2} />
                                                        </Box>
                                                    )}

                                                    <TaskTypeListItem taskType={taskType} setItems={setItems} itemIndex={index} isChange={isChange} setIsChange={setIsChange} />
                                                </Stack>
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </DragDropContext>
                <Box
                // sx={{
                //     borderBottom: "1px solid",
                //     borderColor: getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])
                // }}
                >
                    <Button
                        onClick={() => addNewItem()}
                        fullWidth
                        color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}
                        sx={{
                            justifyContent: 'flex-start'
                        }}
                        startIcon={<AddIcon size={18} stroke={2} />}
                        disabled={!manageTaskTypePermission}
                    >
                        Add status
                    </Button>
                </Box>
            </Box>
            <Stack direction={'row'} mt={2} justifyContent={'flex-end'} width={'100%'}>
                <Box>
                    <Button size="small" variant='contained' color='primary' onClick={() => handleSave()} disabled={!isChange || !manageTaskTypePermission}>
                        Save
                    </Button>
                </Box>
            </Stack>
        </Card>
    );
};

const TaskTypeListItem = ({ taskType, setItems, itemIndex, isChange, setIsChange }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconX"];
    const EditIcon = TablerIcons["IconEdit"];
    const [name, setName] = useState(taskType.name);
    const [customization, setCustomization] = useState(taskType.customization);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const manageTaskTypePermission = currentMember?.role?.projectPermissions?.includes("MANAGE_TASK_TYPE");

    useEffect(() => {
        if (taskType != null) {
            setName(taskType.name);
            setCustomization(taskType.setCustomization);
        }
    }, [taskType])

    useEffect(() => {
        if (name && name != taskType?.name) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, name: name } : item))
            setIsChange(true);
        }
    }, [name])


    useEffect(() => {
        if (customization != null && customization != taskType?.customization) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, customization: customization } : item))
            setIsChange(true);
        }
    }, [customization])

    const handleOpenDeleteDialog = (event) => {
        setItems(prev => prev.filter((item, index) => index != itemIndex));
        setIsChange(true);
    };

    return (
        <>
            <Box
                sx={{ px: 4, flexGrow: 1 }}
            > <Stack

                direction="row"
                spacing={4}
                alignItems='center'>
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorIconPicker changeable={true} icons={taskTypeIconsList} customization={customization} setCustomization={setCustomization} readOnly={!manageTaskTypePermission} />
                        <CustomBasicTextField
                            size="small"
                            margin="dense"
                            defaultValue={name}
                            fullWidth
                            slotProps={{
                                input: {
                                    readOnly: !manageTaskTypePermission,
                                }
                            }}
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsChange(true);
                            }
                            }
                        />
                    </Stack>
                </Stack>
            </Box>
            {(!taskType.systemRequired && manageTaskTypePermission) &&
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton size="small" onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Box>
            }
        </>
    );
}
export default CustomManageTaskType;
