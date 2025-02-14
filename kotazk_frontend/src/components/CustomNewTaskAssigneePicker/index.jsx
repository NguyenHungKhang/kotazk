import { Avatar, Box, Button, ListItem, Typography, useTheme } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentTaskList } from "../../redux/actions/task.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import * as apiService from '../../api/index'
import { setTaskDialog } from "../../redux/actions/dialog.action";
import CustomMember from "../CustomMember";

const CustomNewTaskAssigneePicker = ({ currentAssignee, setNewTaskAssigneePicker }) => {
    const project = useSelector((state) => state.project.currentProject);
    const [members, setMembers] = useState(null);
    const [assignee, setAssignee] = useState(null);

    useEffect(() => {
        if (currentAssignee) {
            console.log(currentAssignee);
            setAssignee(currentAssignee);
            setNewTaskAssigneePicker(currentAssignee?.id);
        } else if (!currentAssignee && members?.length > 0) {
            setAssignee(null);
            setNewTaskAssigneePicker(null);
        }
    }, [currentAssignee, members]);

    useEffect(() => {
        if (project) {
            fetchAssignee();
        }
    }, [project]);

    const fetchAssignee = async () => {
        try {
            const data = {
                'sortBy': 'user.lastName',
                'sortDirectionAsc': true,
                'filters': [

                ]
            }
            const response = await apiService.memberAPI.getPageByProject(project?.id, data);
            if (response?.data) {
                setMembers([...response?.data.content]);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    const saveAssignee = async (object) => {
        setNewTaskAssigneePicker(object?.id);
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

const CustomAssigneeOpenComponent = ({ onClick, assignee, setTarget, isFocusing }) => {
    const theme = useTheme();
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
            {assignee != null ?
                <CustomMember member={assignee} isShowName={true} />
                :
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        px: 2,
                        py: 1
                    }}
                >
                    <Avatar alt={"Unassigned"}
                        sx={{
                            width: 24,
                            height: 24,
                            marginRight: 1,
                            border: "2px dotted",
                            borderColor: theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400],
                        }}

                    />
                    <Typography variant='body1'>Unassigned</Typography>
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

export default CustomNewTaskAssigneePicker;