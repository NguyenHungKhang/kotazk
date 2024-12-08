import { Box, Button, Card, Checkbox, Grid, IconButton, Paper, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
import { useSelector } from "react-redux";
import CustomPriority from '../CustomPriority/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useRef, useState } from 'react';
import * as TablerIcons from '@tabler/icons-react'
import { priorityIconsList } from "../../utils/iconsListUtil";
import CustomBasicTextField from "../CustomBasicTextField";
import CustomColorIconPicker from "../CustomColorIconPicker";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/actions/snackbar.action";
import { setCurrentPriorityList } from "../../redux/actions/priority.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import { setDeleteDialog } from "../../redux/actions/dialog.action";
import CustomColorPickerDialog from "../CustomColorPicker/CustomColorPickerDialog";

// Helper function to reorder items in the array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const CustomManagePriority = ({ handleClose, isDialog }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const [newPriorityNumber, setNewPriorityNumbeer] = useState(0);
    const [items, setItems] = useState(null);
    const DragIcon = TablerIcons["IconGripVertical"];
    const AddIcon = TablerIcons["IconPlus"];
    const CloseIcon = TablerIcons["IconX"];
    const [isChange, setIsChange] = useState(false);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const managePriorityPermission = currentMember?.role?.projectPermissions?.includes("MANAGE_PRIORITY");

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

        const response = await apiService.priorityAPI.getPageByProject(project.id, data)
        if (response?.data) {
            setItems(response?.data?.content)
        }
    }

    const addNewItem = () => {
        const newItem = {
            "id": `newPriority-${newPriorityNumber}`,
            "projectId": project?.id,
            "name": `Task type ${items.length + 1}`,
            "systemRequired": false,
            "customization": {
                "backgroundColor": "#0d9af2",
            }
        }
        setItems(prev => [...prev, newItem]);
        setNewPriorityNumbeer(prev => prev + 1);
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
            if (item.id.toString().startsWith("newPriority-")) {
                const { id, ...rest } = item;
                return rest;
            }
            return item;
        });
        const response = await apiService.priorityAPI.saveList(project?.id, data);
        if (response?.data) {
            setItems(response.data);
            dispatch(setSnackbar({
                content: "Update priority successful!",
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
                mb={2}
                direction="row"
                spacing={2}
                alignItems="center"
            >
                <Box flexGrow={1}>
                    <TextField
                        fullWidth
                        size="small"
                        margin="dense"
                        placeholder="Search priority..."
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
                    <Droppable droppableId="priorities">
                        {(provided) => (
                            <Stack
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {items?.map((priority, index) => (
                                    <Draggable isDragDisabled={!managePriorityPermission} key={priority.id} draggableId={priority.id.toString()} index={index}>
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
                                                    {managePriorityPermission && (
                                                        <Box {...provided.dragHandleProps} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            <DragIcon size={20} stroke={2} />
                                                        </Box>
                                                    )}
                                                    <PriorityListItem priority={priority} setItems={setItems} itemIndex={index} isChange={isChange} setIsChange={setIsChange} />
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
                        disabled={!managePriorityPermission}
                    >
                        Add status
                    </Button>
                </Box>
            </Box>
            <Stack direction={'row'} mt={2} justifyContent={'flex-end'} width={'100%'}>
                <Box>
                    <Button size="small" variant='contained' color='primary' onClick={() => handleSave()} disabled={!isChange || !managePriorityPermission}>
                        Save
                    </Button>
                </Box>
            </Stack>
        </Card>
    );
};

const PriorityListItem = ({ priority, setItems, itemIndex, isChange, setIsChange }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconX"];
    const EditIcon = TablerIcons["IconEdit"];
    const [name, setName] = useState(priority.name);
    const [backgroundColor, setBackgroundColor] = useState(priority?.customization?.backgroundColor);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const managePriorityPermission = currentMember?.role?.projectPermissions?.includes("MANAGE_PRIORITY");

    useEffect(() => {
        if (priority != null) {
            setName(priority.name);
            setBackgroundColor(priority?.customization?.backgroundColor);
        }
    }, [priority])

    useEffect(() => {
        if (name && name != priority?.name) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, name: name } : item))
            setIsChange(true);
        }
    }, [name])


    useEffect(() => {
        if (backgroundColor != null && backgroundColor != priority?.customization?.backgroundColor) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    {
                        ...item, customization: {
                            backgroundColor: backgroundColor
                        }
                    } : item))
            setIsChange(true);
        }
    }, [backgroundColor])

    const handleOpenDeleteDialog = (event) => {
        setItems(prev => prev.filter((item, index) => index != itemIndex));
        setIsChange(true);
    };

    return (
        <>
            <Box
                sx={{
                    px: 4,
                    flexGrow: 1,
                    // bgcolor: backgroundColor,
                    // borderRadius: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={4}
                    alignItems='center'>
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorPickerDialog color={backgroundColor} setColor={setBackgroundColor} readOnly={!managePriorityPermission} />
                        <CustomBasicTextField
                            size="small"
                            margin="dense"
                            defaultValue={name}
                            fullWidth
                            slotProps={{
                                input: {
                                    readOnly: !managePriorityPermission,
                                }
                            }}
                            onChan
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsChange(true);
                            }
                            }
                        />
                    </Stack>
                </Stack>
            </Box>
            {(!priority.systemRequired && managePriorityPermission) &&
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton size="small" onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Box>
            }
        </>
    );
}
export default CustomManagePriority;
