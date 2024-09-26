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
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [items, setItems] = useState(statuses);
    const DragIcon = TablerIcons["IconGripVertical"];
    const DeleteIcon = TablerIcons["IconTrashXFilled"];
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

    return (
        <Box
            bgcolor={getSecondBackgroundColor(theme)}
            p={4}
            borderRadius={4}
        >
            <Typography variant="h5" fontWeight={500}>
                Status Setting
            </Typography>
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
                    <Button variant="contained" color="success">
                        Add
                    </Button>
                </Box>
            </Stack>

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
                                            <Card
                                                sx={{ py: 2, px: 4,  flexGrow: 1 }}
                                            > <Stack

                                                direction="row"
                                                spacing={4}
                                                alignItems='center'>
                                                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                                                        <CustomColorIconPicker changeable={true} icons={statusIconsList} />
                                                        <CustomBasicTextField
                                                            size="small"
                                                            margin="dense"
                                                            defaultValue={status.name}
                                                            fullWidth
                                                        />
                                                    </Stack>
                                                    <IsFromStartButton />
                                                    <IsFromAnyButton />
                                                    <IsCompletedButton />
                                                </Stack>
                                            </Card>
                                            {/* <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <IconButton>
                                                    <EditIcon size={20} stroke={2} color={theme.palette.info.main} />
                                                </IconButton>
                                            </Card> */}
                                            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <IconButton>
                                                    <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                                                </IconButton>
                                            </Card>
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


function IsFromAnyButton() {
    const [selected, setSelected] = useState(false);

    return (
        <ToggleButton
            value="check"
            color="info"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
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


function IsFromStartButton() {
    const [selected, setSelected] = useState(false);

    return (
        <ToggleButton
            value="check"
            color="warning"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
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

function IsCompletedButton() {
    const [selected, setSelected] = useState(false);

    return (
        <ToggleButton
            value="check"
            color="success"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
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
