import { Box, Button, ListItem, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomStatus from "../CustomStatus";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CustomNewTaskStatusPicker = ({ setStatusForNewTask }) => {
    const statuses = useSelector((state) => state.status.currentStatusList);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        if (statuses) {
            const foundStatus = statuses.find(status => status.isFromStart) || statuses.find(status => status.isFromAny);
            setStatus(foundStatus || null);
            setStatusForNewTask(foundStatus?.id);
        }
    }, [statuses]);

    const saveTaskStatus = async (object) => {
        setStatusForNewTask(object?.id);
    }

    return status == null ? <>Loading</> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomStatusOpenComponent {...props} status={status} />
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

const CustomStatusOpenComponent = ({ onClick, status, isFocusing }) => {
    const theme = useTheme();
    return (
        <Box
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