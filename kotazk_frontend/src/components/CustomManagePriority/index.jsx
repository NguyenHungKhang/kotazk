import { Box, Button, Card, Checkbox, Grid, IconButton, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
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
import CustomColorPicker from "../CustomColorPicker";
import CustomColorPickerDialog from "../CustomColorPicker/CustomColorPickerDialog";

// Helper function to reorder items in the array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const CustomManagePriority = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const project = useSelector((state) => state.project.currentProject)
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [openAddPriority, setOpenAddPriority] = useState(false);
    const [items, setItems] = useState(priorities);
    const DragIcon = TablerIcons["IconGripVertical"];
    const EditIcon = TablerIcons["IconEdit"];

    useEffect(() => {
        if (priorities)
            setItems(priorities);
    }, [, priorities])

    const reorderItem = async (currentItemId, previousItemId, nextItemId) => {
        const data = {
            rePositionReq: (nextItemId == null && previousItemId == null) ? null : {
                currentItemId: currentItemId,
                nextItemId: nextItemId,
                previousItemId: previousItemId
            },
        };

        const response = await apiService.priorityAPI.update(currentItemId, data);
        if (response?.data) {
            const finalAr = updateAndAddArray(priorities, [response.data]);
            dispatch(setCurrentPriorityList(finalAr));
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
                    Priority Setting
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
                        placeholder="Search priority..."
                    />
                </Box>
                <Box>
                    <Button variant="contained" color="success" onClick={() => setOpenAddPriority(true)}>
                        Add
                    </Button>
                </Box>
            </Stack>
            {openAddPriority && <PriorityAddItem priorities={priorities} project={project} setOpenAddPriority={setOpenAddPriority} />}
            {/* DragDropContext to enable drag and drop functionality */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="priorities">
                    {(provided) => (
                        <Stack
                            spacing={2}
                            mt={2}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {items?.map((priority, index) => (
                                <Draggable key={priority.id} draggableId={priority.id.toString()} index={index}>
                                    {(provided) => (

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems='stretch'
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}

                                        >
                                            <Card {...provided.dragHandleProps} sx={{ p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <DragIcon size={20} stroke={2} />
                                            </Card>
                                            <PriorityListItem priority={priority} priorities={priorities} />
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


const PriorityAddItem = ({ priorities, project, setOpenAddPriority }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const CancleIcon = TablerIcons["IconX"];
    const [name, setName] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState(null);
    const [isChange, setIsChange] = useState(false);

    // Ref for the component
    const wrapperRef = useRef(null);

    // Detect clicks outside of the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenAddPriority(false); // Close the component when clicking outside
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpenAddPriority]);

    useEffect(() => {
        setIsChange(name != null && name != "");
    }, [name]);

    const handleSavePriority = async () => {
        const data = {
            name,
            projectId: project?.id
        };
        const response = await apiService.priorityAPI.create(data);
        if (response?.data) {
            dispatch(setCurrentPriorityList(updateAndAddArray(priorities, [response?.data])));
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update priority successful!",
                open: true
            }));
            setOpenAddPriority(false);
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
                        {/* <CustomColorIconPicker changeable={true} icons={priorityIconsList} customization={customization} setCustomization={setCustomization} /> */}
                        <CustomColorPickerDialog color={backgroundColor} setColor={setBackgroundColor} />
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
                    onClick={handleSavePriority}
                    disabled={!isChange}
                >
                    <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.success.main : theme.palette.grey[500]} />
                </IconButton>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => setOpenAddPriority(false)}>
                    <CancleIcon size={20} stroke={2} color={theme.palette.error.main} />
                </IconButton>
            </Card>
        </Stack>
    );
};


const PriorityListItem = ({ priority, priorities }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconTrashXFilled"];
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const [name, setName] = useState(priority.name);
    const [customization, setCustomization] = useState(priority.customization);
    const [backgroundColor, setBackgroundColor] = useState(priority?.customization?.backgroundColor);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (priority != null) {
            setName(priority.name);
            setCustomization(priority.setCustomization);
        }
    }, [priority])

    useEffect(() => {
        if (backgroundColor != null && backgroundColor != priority?.customization?.backgroundColor)
            setIsChange(true);
    }, [backgroundColor])


    const handleSavePriority = async () => {
        const data = {
            "name": name,
            "customization": {
                'backgroundColor': backgroundColor
            }
        }
        const response = await apiService.priorityAPI.update(priority.id, data);
        if (response?.data) {
            dispatch(setCurrentPriorityList(updateAndAddArray(priorities, [response?.data])))
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update priority successful!",
                open: true
            }))
        }
    }

    const handleOpenDeleteDialog = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete priority "${name}"?`,
            content:
                `You're about to permanently delete this priority. <strong>It's task will have empty priority"</strong>.
                <br/><br/>
                If you're not sure, you can resolve or close this priority instead.`,
            open: true,
            deleteType: "DELETE_PRIORITY",
            deleteProps: {
                priorityId: priority?.id
            }
        }));
    };

    return (
        <Stack
            width={"100%"}
            direction="row"
            spacing={2}
            alignItems='center'>
            <Card
                sx={{
                    p: 2, flexGrow: 1,
                }}
            >
                <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>

                    {/* <CustomColorIconPicker changeable={true} icons={priorityIconsList} customization={customization} setCustomization={setCustomization} /> */}
                    <CustomColorPickerDialog color={backgroundColor} setColor={setBackgroundColor} />
                    <CustomBasicTextField
                        size="small"
                        margin="dense"
                        defaultValue={name}
                        fullWidth
                        sx={{
                            bgcolor: backgroundColor || '#0d9af2',
                            borderRadius: 2,
                        }}
                        InputProps={{
                            sx: {
                                color: backgroundColor && theme.palette.getContrastText(backgroundColor),
                                height: 30
                            }
                        }}
                        onChange={(e) => {
                            setName(e.target.value);
                            setIsChange(true);
                        }
                        }
                    />
                </Stack>
            </Card>
            {isChange ?
                <Card sx={{ p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <IconButton
                        onClick={handleSavePriority}
                    >
                        <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.info.main : theme.palette.grey[500]} />
                    </IconButton>
                </Card>
                :

                !priority?.systemRequired &&
                <Card sx={{ p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Card>

            }


        </Stack >
    );
}
export default CustomManagePriority;
