import { Box, Button, ListItem, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomStatus from "../CustomStatus";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as apiService from "../../api/index"

const CustomNewTaskStatusPicker = ({ currentStatus , setStatusForNewTask }) => {
    // const statuses = useSelector((state) => state.status.currentStatusList);
    const project = useSelector((state) => state.project.currentProject);
    const [statuses, setStatuses] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        console.log(currentStatus)
        if (currentStatus) {
            setStatus(currentStatus);
            setStatusForNewTask(currentStatus?.id);
        } else if (currentStatus == null && statuses?.length > 0) {
            const foundStatus = statuses.find(s => s.isFromStart == true)
            setStatus(foundStatus);
            setStatusForNewTask(foundStatus?.id);
        }
    }, [currentStatus, statuses]);

    const saveTaskStatus = async (object) => {
        setStatusForNewTask(object?.id);
    }

    useEffect(() => {
        if (project) {
            fecthStatus();
        }
    }, [project]);

    const fecthStatus = async () => {
        try {
            const data = {
                'sortBy': 'position',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.statusAPI.getPageByProject(project?.id, data);
            if (response?.data) {
                setStatuses([...response?.data.content]);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    return status == null ? <>Loading</> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomStatusOpenComponent {...props} status={status}  />
                )}
                selectedObject={status}
                setSelectedObject={setStatus}
                saveMethod={saveTaskStatus}
                ItemComponent={CustomStatusItemPicker}
                objectsData={statuses}
                isNotNull={true}
            />
        </Box>
    );
}

const CustomStatusOpenComponent = ({ onClick, status, setTarget, isFocusing }) => {
    const theme = useTheme();

    return (
        <Box
            ref={setTarget}
            onClick={() => {
                onClick();
            }}
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
            <CustomStatus status={status} changeable={false} />
        </Box>
    )
}

const CustomStatusItemPicker = (props) => {
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
            <CustomStatus status={props.object} changeable={false} />
        </ListItem>
    )
}

export default CustomNewTaskStatusPicker;