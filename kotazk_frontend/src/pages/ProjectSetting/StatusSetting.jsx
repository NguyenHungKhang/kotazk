import { Box, Button, Card, Checkbox, Grid, IconButton, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import { useSelector } from "react-redux";
import CustomStatus from '../../components/CustomStatus/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import * as TablerIcons from '@tabler/icons-react'
import { statusIconsList } from "../../utils/iconsListUtil";
import CustomBasicTextField from "../../components/CustomBasicTextField";
import CustomColorIconPicker from "../../components/CustomColorIconPicker";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/actions/snackbar.action";
import { setCurrentStatusList } from "../../redux/actions/status.action";
import { updateAndAddArray } from "../../utils/arrayUtil";

// Helper function to reorder items in the array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const StatusSetting = () => {
    const theme = useTheme();
    const statuses = useSelector((state) => state.status.currentStatusList);
    const project = useSelector((state) => state.project.currentProject)
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [openAddStatus, setOpenAddStatus] = useState(false);
    const [items, setItems] = useState(statuses);
    const DragIcon = TablerIcons["IconGripVertical"];
    const EditIcon = TablerIcons["IconEdit"];

    useEffect(() => {
        if (statuses)
            setItems(statuses);
    }, [, statuses])

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) {
            return;
        }
        const reorderedItems = reorder(items, source.index, destination.index);
        setItems(reorderedItems);
    };

    // const handleSaveStatus = async (status) => {
    //     try {
    //         const data = {
    //             "name": 
    //         }
    //        const response = await apiService.statusAPI.update(status.id);
    //     } catch (e) {

    //     }
    // }


    return (
        <Box
            bgcolor={getSecondBackgroundColor(theme)}
            p={4}
            borderRadius={4}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h5" fontWeight={500} flexGrow={1}>
                    Status Setting
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
                        placeholder="Search status..."
                    />
                </Box>
                <Box>
                    <Button variant="contained" color="success" onClick={() => setOpenAddStatus(true)}>
                        Add
                    </Button>
                </Box>
            </Stack>
            {openAddStatus && <StatusAddItem statuses={statuses} project={project} setOpenAddStatus={setOpenAddStatus} />}
            {/* DragDropContext to enable drag and drop functionality */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="statuses">
                    {(provided) => (
                        <Stack
                            spacing={2}
                            mt={2}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {items?.map((status, index) => (
                                <Draggable key={status.id} draggableId={status.id.toString()} index={index}>
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
                                            <StatusListItem status={status} statuses={statuses} />
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

    useEffect(() => {
        setIsChange(name != null && name != "");
    }, [name])


    const handleSaveStatus = async () => {
        const data = {
            "name": name,
            "isFromStart": isFromStart,
            "isFromAny": isFromAny,
            "isCompletedStatus": isCompletedStatus,
            "customization": customization,
            "projectId": project?.id
        }
        const response = await apiService.statusAPI.create(data);
        if (response?.data) {
            dispatch(setCurrentStatusList(updateAndAddArray(statuses, [response?.data])))
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update status successful!",
                open: true
            }))
            setOpenAddStatus(false)
        }
    }

    return (

        <Stack direction='row' spacing={2} border='2px dashed' p={2} borderColor={theme.palette.success.main}>
            <Card
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
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <IconButton
                    onClick={handleSaveStatus}
                    disabled={!isChange}
                >
                    <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.success.main : theme.palette.grey[500]} />
                </IconButton>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => setOpenAddStatus(false)}>
                    <CancleIcon size={20} stroke={2} color={theme.palette.error.main} />
                </IconButton>
            </Card>
        </Stack>

    );
}

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
        console.log(data)
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

    return (
        <>
            <Card
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
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <IconButton
                    onClick={handleSaveStatus}
                    disabled={!isChange}
                >
                    <EditIcon size={20} stroke={2} color={isChange ? theme.palette.info.main : theme.palette.grey[500]} />
                </IconButton>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton>
                    <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                </IconButton>
            </Card>
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
                setIsChange(true);
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
                setIsChange(true);
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
                setIsChange(true);
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

export default StatusSetting;
