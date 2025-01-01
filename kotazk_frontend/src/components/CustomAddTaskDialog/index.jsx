import { DialogTitle, Slide, Stack, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as apiService from '../../api/index';
import { setAddTaskDialog } from '../../redux/actions/dialog.action';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from '../../redux/actions/task.action';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import CustomBasicTextField from '../CustomBasicTextField';
import CustomNewTaskAssigneePicker from '../CustomNewTaskAssigneePicker';
import CustomNewTaskDueDateTimePicker from '../CustomNewTaskDueDateTimePicker';
import CustomNewTaskPriorityPicker from '../CustomNewTaskPriorityPicker';
import CustomNewTaskStatusPicker from '../CustomNewTaskStatusPicker';
import CustomNewTaskTaskTypePicker from '../CustomNewTaskTaskTypePicker';
import { NewTaskDescriptionComponent } from './NewTaskDescriptionComponent';
import CustomTextFieldWithValidation from '../CustomTextFieldWithValidation';
import { regexDefault, taskNameRegex } from '../../utils/regexUtil';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function CustomAddTaskDialog() {
    const theme = useTheme();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');
    const { open, props } = useSelector((state) => state.dialog.addTaskDialog);
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const [name, setName] = useState(null);
    const [desc, setDesc] = useState(null);
    const [status, setStatus] = useState(null);
    const [priority, setPriority] = useState(null);
    const [taskType, setTaskType] = useState(null);
    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [nameError, setNameError] = useState(true);

    const handleClose = () => {
        dispatch(setAddTaskDialog({ open: false }))
    };

    const handleAddNewTask = async () => {
        if (name == null || name.trim() == "")
            return;
        const data = {
            "name": name,
            "projectId": project?.id,
            "description": desc?.trim() != "" ? desc : null,
            "statusId": status,
            "priorityId": priority,
            "taskTypeId": taskType,
            "startAt": startAt,
            "endAt": endAt,
            "assigneeId": assignee
        }

        try {

            const newTaskResponse = await apiService.taskAPI.create(data);
            if (newTaskResponse?.data) {
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(newTaskResponse?.data))
                else
                    dispatch(addAndUpdateTaskList(newTaskResponse?.data));

                dispatch(setAddTaskDialog({ open: false, props: null }));
                setName(null);
                setDesc(null);
                setStatus(null);
                setPriority(null);
                setTaskType(null);
                setStartAt(null);
                setEndAt(null);
                setAssignee(null);
                setNameError(true);

                dispatch(setSnackbar({
                    content: "Task created successful!",
                    type: 'success',
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    }

    const handleAvaiableSave = () => {
        if (nameError) return false;
        if (!status) return false;
        if (!taskType) return false;

        return true;
    }

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            // hideBackdrop={true}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    bgcolor: `${theme.palette.background.default} !important`,
                    position: 'fixed',
                    top: 100,
                    margin: 0,  // Remove any margin
                    maxWidth: 800,
                    padding: 0,  // Remove any padding
                    borderRadius: 0,  // Remove border-radius to make it flush with edges
                    transform: 'none',  // Prevent default MUI positioning transform
                    borderRadius: 2
                }
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: theme.palette.mode == "light" ? 'white' : '#1e1e1e',
                }}
            >
                Add new task
            </DialogTitle>
            <DialogContent
                sx={{
                    bgcolor: theme.palette.mode == "light" ? 'white' : '#1e1e1e',
                }}
            >
                <Box
                    mb={2}
                    bgcolor={getSecondBackgroundColor(theme)}
                    alignItems={'center'}
                    borderRadius={2}
                >
                    <CustomTextFieldWithValidation
                        id="name"
                        name="name"
                        size="small"
                        placeholder='Enter task name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        setFormError={setNameError}
                        maxLength={80}
                        required
                        defaultHelperText="Enter the task name."

                    />
                </Box>
                <Box mb={2}>
                    <NewTaskDescriptionComponent content={desc} setContent={setDesc} />
                </Box>
                <Stack direction='row' spacing={2} p={2} bgcolor={getSecondBackgroundColor(theme)} alignItems={'center'} borderRadius={2}>
                    <CustomNewTaskStatusPicker currentStatus={props?.groupBy == "status" ? props.groupByEntity : null} setStatusForNewTask={setStatus} />
                    <CustomNewTaskTaskTypePicker currentTaskType={props?.groupBy == "taskType" ? props.groupByEntity : null} setNewTaskTaskTypePicker={setTaskType} />
                    <CustomNewTaskPriorityPicker currentPriority={props?.groupBy == "priority" ? props.groupByEntity : null} setNewTaskPriority={setPriority} />
                    <CustomNewTaskDueDateTimePicker setNewTaskStartAt={setStartAt} setNewTaskEndAt={setEndAt} />
                    <CustomNewTaskAssigneePicker currentAssignee={props?.groupBy == "assignee" ? props.groupByEntity : null} setNewTaskAssigneePicker={setAssignee} />
                </Stack>
            </DialogContent>
            <DialogActions
                sx={{
                    bgcolor: theme.palette.mode == "light" ? 'white' : '#1e1e1e',
                }}
            >
                <Button onClick={handleAddNewTask} color="success" variant='contained' size='small' disabled={!handleAvaiableSave()}>Add</Button>
                <Button onClick={handleClose} color="error" variant='contained' size='small'>Cancle</Button>
            </DialogActions>
        </Dialog>
    );
}
