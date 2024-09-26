import { Box, Button, ListItem, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import CustomTaskType from "../CustomTaskType";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";

const CustomNewTaskTaskTypePicker = ({ setNewTaskTaskTypePicker}) => {
    const taskTypes = useSelector((state) => state.taskType.currentTaskTypeList)
    const [taskType, setTaskType] = useState(null);

    useEffect(() => {
        if (taskTypes) {
            const foundTaskType = taskTypes.find(tt => tt.position);
            setTaskType(foundTaskType || null);
            setNewTaskTaskTypePicker(foundTaskType?.id);
        }
    }, [taskTypes]);

    const saveTaskType = async (object) => {
        setNewTaskTaskTypePicker(object?.id);
    }

    return taskType == null ? <>Loading...</> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomTaskTypeOpenComponent {...props} taskType={taskType} />
                )}
                selectedObject={taskType}
                setSelectedObject={setTaskType}
                saveMethod={saveTaskType}
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
                p: 1,
                '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                },
                bgcolor: isFocusing ? (theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700]) : (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900])
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

export default CustomNewTaskTaskTypePicker;