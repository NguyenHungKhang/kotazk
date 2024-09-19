import { Box, Button, ListItem, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomStatus from "../CustomStatus";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const dummyData = [
    { id: 1, name: 'Status 1' },
    { id: 2, name: 'Status 2' },
    { id: 3, name: 'Status 3' },
    { id: 4, name: 'Status 4' },
    // Add more objects if needed
];

const CustomStatusPicker = ({ statusId }) => {
    const statuses = useSelector((state) => state.status.currentStatusList);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        if (statuses && statusId != null) {
            const foundStatus = statuses.find(status => status.id === statusId);
            setStatus(foundStatus || null); 
        }
    }, [statuses, statusId]);

    return status == null ? <>Loading</> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomStatusOpenComponent {...props} status={status} />
                )}
                selectedObject={status}
                setSelectedObject={setStatus}
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
                py: 1,
                px: 2,
                '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
                },
                bgcolor: isFocusing ? (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]) : null
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

export default CustomStatusPicker;