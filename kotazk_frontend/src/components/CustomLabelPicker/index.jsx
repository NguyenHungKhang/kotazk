import { Box, Button, IconButton, ListItem, Stack, useTheme } from "@mui/material";
import CustomLabel from "../CustomLabel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";
import CustomPickerMultiObjectDialog from "../CustomPickerMultiObjectDialog";
import * as TablerIcon from '@tabler/icons-react'

const CustomLabelPicker = ({ labelIds, taskId }) => {
    const labels = useSelector((state) => state.label.currentLabelList)
    const tasks = useSelector((state) => state.task.currentTaskList)
    const [selectedLabels, setSelectedLabels] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (labels && labelIds) {
            const foundLabels = labels.filter(label => labelIds.includes(label.id));
            setSelectedLabels(foundLabels);
        }
    }, [labels, labelIds]);

    const saveLabel = async (objects) => {
        const data = {
            "labelIds": objects.map(obj => obj.id)
        }

        try {
            const response = await apiService.taskAPI.update(taskId, data);
            if (response?.data) {
                dispatch(setCurrentTaskList(updateAndAddArray(tasks, [response.data])));
                const taskDialogData = {
                    task: response.data
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    return (
        <Stack direction='row' spacing={2} alignItems='center'>
            <CustomPickerMultiObjectDialog

                OpenComponent={(props) => (
                    <CustomLabelOpenComponent {...props} />
                )}
                selectedObjects={selectedLabels}
                setSelectedObjects={setSelectedLabels}
                saveMethod={saveLabel}
                ItemComponent={CustomLabelItemPicker}
                objectsData={labels}
                isNotNull={true}
            />

            <Box
                width='100%'
                sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    py: 1,
                    px: 2,

                }}
            >

                <Stack direction='row' spacing={2} >
                    {selectedLabels.map((label) => (
                        <CustomLabel key={label.id} label={label} changeable={false} alwaysShowLabel={true} />
                    ))}

                </Stack>

            </Box>
        </Stack>

    );
}

const CustomLabelOpenComponent = () => {
    const theme = useTheme();
    const AddIcon = TablerIcon["IconPlus"]
    return (
        <IconButton
            size="small"
        >
            <AddIcon stroke={2} size={20} />
        </IconButton>
    )
}

const CustomLabelItemPicker = (props) => {
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
            onClick={(event) => props.onClick(props.object, event)}
            dense
        >
            <CustomLabel label={props.object} alwaysShowLabel={true} />
        </ListItem>
    )
}

export default CustomLabelPicker;