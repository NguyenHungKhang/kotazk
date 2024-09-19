import { Box, Button, ListItem, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomTaskType from "../CustomTaskType";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CustomTaskTypePicker = ({ taskTypeId }) => {
    const taskTypes = useSelector((state) => state.taskType.currentTaskTypeList)
    const [taskType, setTaskType] = useState(null);

    useEffect(() => {
        if (taskTypes && taskTypeId != null) {
            const foundTaskType = taskTypes.find(taskType => taskType.id === taskTypeId);
            setTaskType(foundTaskType || null); 
        }
    }, [taskTypes, taskTypeId]);
    return taskType == null ? <>Loading...</> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomTaskTypeOpenComponent {...props} taskType={taskType} />
                )}
                selectedObject={taskType}
                setSelectedObject={setTaskType}
                ItemComponent={CustomTaskTypeItemPicker}
                objectsData={taskTypes}
                isNotNull={true}
            />
        </Box>
    );
}

const CustomTaskTypeOpenComponent = ({ onClick, taskType, isFocusing }) => {
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
            <CustomTaskType taskType={taskType} changeable={false}/>
        </Box>
    )
}

const CustomTaskTypeItemPicker = (props) => {
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
            <CustomTaskType taskType={props.object} changeable={false}/>
        </ListItem>
    )
}

export default CustomTaskTypePicker;