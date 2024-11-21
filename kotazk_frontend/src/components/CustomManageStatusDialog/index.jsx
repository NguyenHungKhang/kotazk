import { Box, Button, Card, Checkbox, Grid, IconButton, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import { useSelector } from "react-redux";
import CustomStatus from '../CustomStatus/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useRef, useState } from 'react';
import * as TablerIcons from '@tabler/icons-react'
import { statusIconsList } from "../../utils/iconsListUtil";
import CustomBasicTextField from "../CustomBasicTextField";
import CustomColorIconPicker from "../CustomColorIconPicker";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/actions/snackbar.action";
import { setCurrentStatusList } from "../../redux/actions/status.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import { setDeleteDialog } from "../../redux/actions/dialog.action";

// Helper function to reorder items in the array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const CustomManageStatus = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const statuses = useSelector((state) => state.status.currentStatusList);
    const project = useSelector((state) => state.project.currentProject)
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [openAddStatus, setOpenAddStatus] = useState(false);
    const [items, setItems] = useState(null);
    const DragIcon = TablerIcons["IconGripVertical"];
    const EditIcon = TablerIcons["IconEdit"];

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

        const response = await apiService.statusAPI.getPageByProject(project.id, data)
        if (response?.data) {
            dispatch(setCurrentStatusList(response?.data?.content))
        }
    }

    useEffect(() => {
        if (statuses)
            setItems(statuses);
    }, [, statuses])

    const reorderItem = async (currentItemId, previousItemId, nextItemId) => {
        const data = {
            rePositionReq: (nextItemId == null && previousItemId == null) ? null : {
                currentItemId: currentItemId,
                nextItemId: nextItemId,
                previousItemId: previousItemId
            },
        };

        const response = await apiService.statusAPI.update(currentItemId, data);
        if (response?.data) {
            const finalAr = updateAndAddArray(statuses, [response.data]);
            dispatch(setCurrentStatusList(finalAr));
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


    return items == null ? <>Loading ...</> : (
        <Card
            sx={{
                p: 4,
                height: '100%'
            }}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h5" fontWeight={500} flexGrow={1}>
                    Status Setting
                </Typography>
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
                        placeholder="Search status..."
                    />
                </Box>
                <Box>
                    <Button variant="contained" color="success" onClick={() => setOpenAddStatus(true)}>
                        Add
                    </Button>
                </Box>
            </Stack>
            <Box
                bgcolor={getSecondBackgroundColor(theme)}
                borderRadius={2}
                p={2}
            >
                {openAddStatus && <StatusAddItem statuses={statuses} project={project} setOpenAddStatus={setOpenAddStatus} />}
                {/* DragDropContext to enable drag and drop functionality */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="statuses">
                        {(provided) => (
                            <Stack
                                spacing={2}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {items?.map((status, index) => (
                                    <Draggable key={status.id} draggableId={status.id.toString()} index={index}>
                                        {(provided) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems='stretch'


                                                >
                                                    <Box {...provided.dragHandleProps} sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <DragIcon size={20} stroke={2} />
                                                    </Box>
                                                    <StatusListItem status={status} statuses={statuses} />

                                                </Stack>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>
        </Card>
    );
};


const StatusAddItem = ({ statuses, project, setOpenAddStatus }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const CancleIcon = TablerIcons["IconX"];

    const [name, setName] = useState(null);
    const [isFromStart, setIsFromStart] = useState(false);
    const [isFromAny, setIsFromAny] = useState(true);
    const [isCompletedStatus, setIsCompletedStatus] = useState(false);
    const [customization, setCustomization] = useState(null);
    const [isChange, setIsChange] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenAddStatus(false); // Close the component when clicking outside
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpenAddStatus]);

    useEffect(() => {
        setIsChange(name != null && name != "");
    }, [name]);

    const handleSaveStatus = async () => {
        const data = {
            name,
            isFromStart,
            isFromAny,
            isCompletedStatus,
            customization,
            projectId: project?.id
        };
        const response = await apiService.statusAPI.create(data);
        if (response?.data) {
            dispatch(setCurrentStatusList(updateAndAddArray(statuses, [response?.data])));
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update status successful!",
                open: true
            }));
            setOpenAddStatus(false);
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
            <Box sx={{ py: 2, px: 4, flexGrow: 1 }}>
                <Stack
                    direction="row"
                    spacing={4}
                    alignItems='center'
                >
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorIconPicker changeable={true} icons={statusIconsList} customization={customization} setCustomization={setCustomization} />
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
                    <IsFromStartButton selected={isFromStart} setSelected={setIsFromStart} />
                    <IsFromAnyButton selected={isFromAny} setSelected={setIsFromAny} />
                    <IsCompletedButton selected={isCompletedStatus} setSelected={setIsCompletedStatus} />
                </Stack>
            </Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                    onClick={handleSaveStatus}
                    disabled={!isChange}
                >
                    <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.success.main : theme.palette.grey[500]} />
                </IconButton>
            </Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => setOpenAddStatus(false)}>
                    <CancleIcon size={20} stroke={2} color={theme.palette.error.main} />
                </IconButton>
            </Box>
        </Stack>
    );
};


const StatusListItem = ({ status, statuses }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconTrashXFilled"];
    const EditIcon = TablerIcons["IconEdit"];
    const [name, setName] = useState(status.name);
    const [isFromStart, setIsFromStart] = useState(status.isFromStart);
    const [isFromAny, setIsFromAny] = useState(status.isFromAny);
    const [isCompletedStatus, setIsCompletedStatus] = useState(status.isCompletedStatus);
    const [customization, setCustomization] = useState(status.customization);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (status != null) {
            setName(status.name);
            setIsFromStart(status.isFromStart);
            setIsFromAny(status.isFromAny);
            setIsCompletedStatus(status.isCompletedStatus);
            setCustomization(status.setCustomization);
        }
    }, [status])

    useEffect(() => {
        if (customization != null && customization != status.customization)
            setIsChange(true);
    }, [customization])


    const handleSaveStatus = async () => {
        const data = {
            "name": name,
            "isFromStart": isFromStart,
            "isFromAny": isFromAny,
            "isCompletedStatus": isCompletedStatus,
            "customization": customization
        }
        const response = await apiService.statusAPI.update(status.id, data);
        if (response?.data) {
            dispatch(setCurrentStatusList(updateAndAddArray(statuses, [response?.data])))
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update status successful!",
                open: true
            }))
        }
    }

    const handleOpenDeleteDialog = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete status "${name}"?`,
            content:
                `You're about to permanently delete this status. <strong>It's task will be moved to the first "Started status"</strong>.
                <br/><br/>
                If you're not sure, you can resolve or close this status instead.`,
            open: true,
            deleteType: "DELETE_STATUS",
            deleteProps: {
                statusId: status?.id
            }
        }));
    };

    return (
        <>
            <Box
                sx={{ py: 2, px: 4, flexGrow: 1 }}
            > <Stack

                direction="row"
                spacing={4}
                alignItems='center'>
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorIconPicker changeable={true} icons={statusIconsList} customization={customization} setCustomization={setCustomization} />
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
                    <IsFromStartButton selected={isFromStart} setSelected={setIsFromStart} setIsChange={setIsChange} />
                    <IsFromAnyButton selected={isFromAny} setSelected={setIsFromAny} setIsChange={setIsChange} />
                    <IsCompletedButton selected={isCompletedStatus} setSelected={setIsCompletedStatus} setIsChange={setIsChange} />
                </Stack>
            </Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <IconButton
                    onClick={handleSaveStatus}
                    disabled={!isChange}
                >
                    <EditIcon size={20} stroke={2} color={isChange ? theme.palette.info.main : theme.palette.grey[500]} />
                </IconButton>
            </Box>
            {!status.systemRequired &&
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Box>
            }
        </>
    );
}

function IsFromAnyButton({ selected, setSelected, setIsChange }) {

    return (
        <ToggleButton
            value="check"
            color="info"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
                setIsChange != null && setIsChange(true);
            }}
            sx={{
                textTransform: 'none'
            }}
            size="small"
        >
            Flexible status
        </ToggleButton>
    );
}


function IsFromStartButton({ selected, setSelected, setIsChange }) {
    return (
        <ToggleButton
            value="check"
            color="warning"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
                setIsChange != null && setIsChange(true);
            }}
            sx={{
                textTransform: 'none'
            }}
            size="small"
        >
            Started status
        </ToggleButton>
    );
}

function IsCompletedButton({ selected, setSelected, setIsChange }) {
    return (
        <ToggleButton
            value="check"
            color="success"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
                setIsChange != null && setIsChange(true);
            }}
            sx={{
                textTransform: 'none'
            }}
            size="small"
        >
            Completed status
        </ToggleButton>
    );
}

export default CustomManageStatus;
