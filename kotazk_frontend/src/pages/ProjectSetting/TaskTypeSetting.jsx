import { Box, Button, Card, Checkbox, Grid, IconButton, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import { useSelector } from "react-redux";
import CustomTaskType from '../../components/CustomTaskType/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import * as TablerIcons from '@tabler/icons-react'
import { taskTypeIconsList } from "../../utils/iconsListUtil";
import CustomBasicTextField from "../../components/CustomBasicTextField";
import CustomColorIconPicker from "../../components/CustomColorIconPicker";

// Helper function to reorder items in the array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const TaskTypeSetting = () => {
    const theme = useTheme();
    const taskTypes = useSelector((state) => state.taskType.currentTaskTypeList);
    const [selectedTaskType, setSelectedTaskType] = useState(null);
    const [items, setItems] = useState(taskTypes);
    const DragIcon = TablerIcons["IconGripVertical"];
    const DeleteIcon = TablerIcons["IconTrashXFilled"];
    const EditIcon = TablerIcons["IconEdit"];

    useEffect(() => {
        if (taskTypes)
            setItems(taskTypes);
    }, [, taskTypes])

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
                TaskType Setting
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
                        placeholder="Search taskType..."
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
                                            <Card
                                                sx={{ py: 2, px: 4,  flexGrow: 1 }}
                                            > <Stack

                                                direction="row"
                                                spacing={4}
                                                alignItems='center'>
                                                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                                                        <CustomColorIconPicker changeable={true} icons={taskTypeIconsList} />
                                                        <CustomBasicTextField
                                                            size="small"
                                                            margin="dense"
                                                            defaultValue={taskType.name}
                                                            fullWidth
                                                        />
                                                    </Stack>
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
            Flexible taskType
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
            Started taskType
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
            Completed taskType
        </ToggleButton>
    );
}

export default TaskTypeSetting;
