import { Box, Button, IconButton, ListItem, Skeleton, Stack, useTheme } from "@mui/material";
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

const CustomLabelPicker = ({ currentLabelList, taskId }) => {
    const project = useSelector((state) => state.project.currentProject)
    const [labels, setLabels] = useState(null);
    const tasks = useSelector((state) => state.task.currentTaskList)
    const [selectedLabels, setSelectedLabels] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (project != null)
            listLabelsFetch()
    }, [project])

    const listLabelsFetch = async () => {
        try {
            const data = {
                'sortBy': 'name',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.labelAPI.getPageByProject(project.id, data);
            if (response?.data) {
                setLabels(response?.data.content);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    useEffect(() => {
        if (currentLabelList != null) {
            setSelectedLabels(currentLabelList);
        }
    }, [currentLabelList]);

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

    return (labels == null) ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
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
            sx={{
                p: 1
            }}
        >
            <AddIcon stroke={2} size={18} />
        </IconButton>
    )
}

const CustomLabelItemPicker = (props) => {
    const theme = useTheme();
    const currentMember = useSelector((state) => state.member.currentUserMember);

    return (
        <ListItem
            sx={{
                py: 0,
                px: 1,
                my: 1,
                cursor: currentMember?.role?.projectPermissions.includes("EDIT_TASKS") ? 'pointer' : null,
                '&:hover': {
                    backgroundColor: currentMember?.role?.projectPermissions.includes("EDIT_TASKS") ? theme.palette.action.hover : null,
                }
            }}
            onClick={(event) => {
                if (currentMember?.role?.projectPermissions.includes("EDIT_TASKS")) {
                    props.onClick(props.object, event);
                }
            }}
            dense
        >
            <CustomLabel label={props.object} alwaysShowLabel={true} />
        </ListItem>
    )
}

export default CustomLabelPicker;