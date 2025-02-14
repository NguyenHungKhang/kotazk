import { Box, Button, ListItem, Stack, Typography, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomPriority from "../CustomPriority";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";
import * as TablerIcons from '@tabler/icons-react';

const CustomNewTaskPriorityPicker = ({ currentPriority, setNewTaskPriority }) => {
    const project = useSelector((state) => state.project.currentProject);
    const [priorities, setPriorities] = useState([]);
    const [priority, setPriority] = useState(null);

    useEffect(() => {
        if (currentPriority) {
            setPriority(currentPriority);
            setNewTaskPriority(currentPriority?.id);
        } else if (!currentPriority && priorities?.length > 0) {
            const foundPriority = priorities.find(t => t.name == "Task")
            setPriority(foundPriority);
            setNewTaskPriority(foundPriority?.id);
        }
    }, [currentPriority, priorities]);

    useEffect(() => {
        if (project) {
            fetchPriority();
        }
    }, [project]);

    const savePriority = async (object) => {
        setNewTaskPriority(object?.id)
    }

    const fetchPriority = async () => {
        try {
            const data = {
                'sortBy': 'position',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.priorityAPI.getPageByProject(project?.id, data);
            if (response?.data) {
                setPriorities([...response?.data.content]);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    return (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomPriorityOpenComponent {...props} priority={priority} />
                )}
                selectedObject={priority}
                setSelectedObject={setPriority}
                saveMethod={savePriority}
                ItemComponent={CustomPriorityItemPicker}
                objectsData={priorities}
                isNotNull={false}
            />
        </Box>
    );
}

const CustomPriorityOpenComponent = ({ onClick, priority, setTarget, isFocusing }) => {
    const theme = useTheme();
    const PriorityIcon = TablerIcons["IconFlag"]
    return (
        <Box
            ref={setTarget}
            onClick={onClick}
            width='100%'
            sx={{
                cursor: 'pointer',
                borderRadius: 2,
                p: 1,
                '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                },
                bgcolor: isFocusing ? (theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700]) : (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900])
            }}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <PriorityIcon stroke={2} size={16} />
                {priority != null ?
                    <CustomPriority priority={priority} changeable={false} />
                    :
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            p: 1
                        }}
                    >
                        <Typography variant='body2'>Priority</Typography>
                    </Box>
                }
            </Stack>
        </Box>
    )
}

const CustomPriorityItemPicker = (props) => {
    const theme = useTheme();
    return (
        <ListItem
            sx={{
                py: 0,
                px: 1,
                my: 1,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                }
            }}
            onClick={() => props.onClick(props.object)}
            dense
        >
            <CustomPriority priority={props.object} changeable={false} />
        </ListItem>
    )
}

export default CustomNewTaskPriorityPicker;