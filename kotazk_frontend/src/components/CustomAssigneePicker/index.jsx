import { Box, Button, ListItem, Typography, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";
import CustomMember from "../CustomMember";

const CustomAssigneePicker = ({ memberId, taskId }) => {
    const members = useSelector((state) => state.member.currentProjectMemberList)
    const tasks = useSelector((state) => state.task.currentTaskList)
    const [assignee, setAssignee] = useState(memberId ? members.find(member => member.id === memberId) : null);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (members && memberId != null) {
    //         const foundAssignee = members.find(member => member.id === memberId);
    //         setAssignee(foundAssignee || null);
    //     }
    // }, [members, memberId]);

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

    return (
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
                        py: 1,
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
            <CustomMember member={props.object} isShowName={true}  />
        </ListItem>
    )
}

export default CustomAssigneePicker;