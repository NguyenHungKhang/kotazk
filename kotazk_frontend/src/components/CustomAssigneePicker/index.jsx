import { Box, Button, ListItem, Skeleton, Typography, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";
import CustomMember from "../CustomMember";

const CustomAssigneePicker = ({ currentAssignee, taskId }) => {
    const project = useSelector((state) => state.project.currentProject)
    const [members, setMembers] = useState(null);
    const tasks = useSelector((state) => state.task.currentTaskList)
    const [assignee, setAssignee] = useState(currentAssignee ? currentAssignee : null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (project != null)
            listMemberFetch()
    }, [project])

    const listMemberFetch = async () => {
        try {
            const data = {
                'sortBy': 'user.lastName',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.memberAPI.getPageByProject(project.id, data);
            if (response?.data) {
                setMembers(response?.data.content);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }


    const saveAssignee = async (object) => {
        const data = {
            "assigneeId": object ? object.id : 0,
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

    return (members == null) ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
        <Box>
            <CustomPickerSingleObjectDialog

                OpenComponent={(props) => (
                    <CustomAssigneeOpenComponent {...props} assignee={assignee} />
                )}
                selectedObject={assignee}
                setSelectedObject={setAssignee}
                saveMethod={saveAssignee}
                ItemComponent={CustomAssigneeItemPicker}
                objectsData={members}
                isNotNull={false}
            />
        </Box>
    );
}

const CustomAssigneeOpenComponent = ({ onClick, assignee, isFocusing }) => {
    const theme = useTheme();
    return (
        <Box
            onClick={onClick}
            width='100%'
            sx={{
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': {
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
                },
                bgcolor: isFocusing ? (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]) : null
            }}
        >
            {assignee != null ?
                <CustomMember member={assignee} isShowName={true} />
                :
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        px: 2,
                        py: 2,
                    }}
                >
                    <Typography variant='body2'>Empty</Typography>
                </Box>
            }
        </Box>
    )
}

const CustomAssigneeItemPicker = (props) => {
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
            <CustomMember member={props.object} isShowName={true} />
        </ListItem>
    )
}

export default CustomAssigneePicker;