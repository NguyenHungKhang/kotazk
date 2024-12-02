import { Box, Button, Card, Checkbox, Divider, Grid, IconButton, Paper, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
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

const CustomManageStatus = ({ handleClose, isDialog }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject)
    const [newStatusNumber, setNewStatusNumbeer] = useState(0);
    const [items, setItems] = useState(null);
    const DragIcon = TablerIcons["IconGripVertical"];
    const AddIcon = TablerIcons["IconPlus"];
    const CloseIcon = TablerIcons["IconX"];
    const [isChange, setIsChange] = useState(false);

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
            setItems(response?.data?.content)
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
        setIsChange(true);
    };


    const addNewItem = () => {
        const newItem = {
            "id": `newStatus-${newStatusNumber}`,
            "projectId": project?.id,
            "name": `Status ${items.length + 1}`,
            "isFromStart": false,
            "isFromAny": true,
            "isCompletedStatus": false,
            "systemRequired": false,
            "customization": {
                "backgroundColor": "#0d9af2",
                "icon": "IconCircleDot"
            }
        }
        setItems(prev => [...prev, newItem]);
        setNewStatusNumbeer(prev => prev + 1);
        setIsChange(true);
    }

    const handleSave = async () => {
        const data = items.map((item) => {
            if (item.id.toString().startsWith("newStatus-")) {
                const { id, ...rest } = item;
                return rest;
            }
            return item;
        });
        const response = await apiService.statusAPI.saveList(project?.id, data);
        if (response?.data) {
            setItems(response.data);
            dispatch(setSnackbar({
                content: "Update status successful!",
                open: true
            }));
        }
        setIsChange(false);
    }

    return (
        <Card
            sx={{
                p: 4,
                height: '100%'
            }}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h6" fontWeight={500} flexGrow={1}>
                    Status Setting
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
                        placeholder="Search status..."
                    />
                </Box>
            </Stack>
            <Box
                // bgcolor={getSecondBackgroundColor(theme)}
                // borderRadius={2}
                p={2}
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="statuses">
                        {(provided) => (
                            <Stack
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {items?.map((status, index) => (
                                    <Draggable key={status.id} draggableId={status.id.toString()} index={index}>
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
                                                    <Box {...provided.dragHandleProps} sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <DragIcon size={20} stroke={2} />
                                                    </Box>
                                                    <StatusListItem status={status} setItems={setItems} itemIndex={index} isChange={isChange} setIsChange={setIsChange} />

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
                    sx={{
                        borderBottom: "1px solid",
                        borderColor: getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])
                    }}
                >
                    <Button
                        onClick={() => addNewItem()}
                        fullWidth
                        color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}
                        sx={{
                            justifyContent: 'flex-start'
                        }}
                        startIcon={<AddIcon size={18} stroke={2} />}
                    >
                        Add status
                    </Button>
                </Box>
            </Box>
            <Stack direction={'row'} mt={2} justifyContent={'flex-end'} width={'100%'}>
                <Box>
                    <Button size="small" variant='contained' color='primary' onClick={() => handleSave()} disabled={!isChange}>
                        Save
                    </Button>
                </Box>
            </Stack>
        </Card>
    );
};

const StatusListItem = ({ status, setItems, itemIndex, isChange, setIsChange }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconX"];
    const [name, setName] = useState(status.name);
    const [isFromStart, setIsFromStart] = useState(status.isFromStart);
    const [isFromAny, setIsFromAny] = useState(status.isFromAny);
    const [isCompletedStatus, setIsCompletedStatus] = useState(status.isCompletedStatus);
    const [customization, setCustomization] = useState(status.customization);

    useEffect(() => {
        if (status != null) {
            setName(status.name);
            setIsFromStart(status.isFromStart);
            setIsFromAny(status.isFromAny);
            setIsCompletedStatus(status.isCompletedStatus);
            setCustomization(status.customization);
        }
    }, [status])

    useEffect(() => {
        if (name && name != status?.name) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, name: name } : item))
            setIsChange(true);
        }
    }, [name])

    useEffect(() => {
        if (isFromStart != null && isFromStart != status?.isFromStart) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, isFromStart: isFromStart } : item))
            setIsChange(true);
        }
    }, [isFromStart])

    useEffect(() => {
        if (isFromAny != null && isFromAny != status?.isFromAny) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, isFromAny: isFromAny } : item))
            setIsChange(true);
        }
    }, [isFromAny])

    useEffect(() => {
        if (isCompletedStatus != null && isCompletedStatus != status?.isCompletedStatus) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, isCompletedStatus: isCompletedStatus } : item))
            setIsChange(true);
        }
    }, [isCompletedStatus])


    useEffect(() => {
        if (customization != null && customization != status?.customization) {
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
            {status.systemRequired == false ?
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton size="small" onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Box>
                :
                <Box
                    width={30}
                    height={30}
                />
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
                textTransform: 'none',
                py: 1
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
                textTransform: 'none',
                py: 1
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
                textTransform: 'none',
                py: 1
            }}
            size="small"
        >
            Completed status
        </ToggleButton>
    );
}

export default CustomManageStatus;
