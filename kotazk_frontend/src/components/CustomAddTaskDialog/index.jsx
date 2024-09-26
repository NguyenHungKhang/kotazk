import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAddTaskDialog } from '../../redux/actions/dialog.action';
import CustomBasicTextField from '../CustomBasicTextField';
import CustomNewTaskStatusPicker from '../CustomNewTaskStatusPicker';
import { useState } from 'react';
import { Stack } from '@mui/material';
import CustomNewTaskPriorityPicker from '../CustomNewTaskPriorityPicker';
import CustomNewTaskTaskTypePicker from '../CustomNewTaskTaskTypePicker';
import CustomNewTaskDueDateTimePicker from '../CustomNewTaskDueDateTimePicker';
import CustomNewTaskAssigneePicker from '../CustomNewTaskAssigneePicker';
import * as apiService from '../../api/index'
import { setCurrentTaskList } from '../../redux/actions/task.action';
import { updateAndAddArray } from '../../utils/arrayUtil';
import { setSnackbar } from '../../redux/actions/snackbar.action';

export default function CustomAddTaskDialog() {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');
    const { open } = useSelector((state) => state.dialog.addTaskDialog);
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const tasks = useSelector((state) => state.task.currentTaskList);
    const [name, setName] = useState(null);
    const [status, setStatus] = useState(null);
    const [priority, setPriority] = useState(null);
    const [taskType, setTaskType] = useState(null);
    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);
    const [assignee, setAssignee] = useState(null);

    const handleClose = () => {
        dispatch(setAddTaskDialog({ open: false }))
    };

    const handleAddNewTask = async () => {
        const data = {
            "name": name,
            "projectId": project?.id,
            "description": null,
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
                dispatch(setCurrentTaskList(updateAndAddArray(tasks, [newTaskResponse.data])));
                dispatch(setAddTaskDialog({ open: false }));
                dispatch(setSnackbar({
                    content: "Task created successful!",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    }

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
        >
            {/* <DialogTitle>Optional sizes</DialogTitle> */}
            <DialogContent>
                <Box>
                    <CustomBasicTextField
                        required
                        // defaultValue={task?.name}
                        size="small"
                        id="name"
                        name="name"
                        fullWidth
                        placeholder='Name of task...'
                        InputProps={{
                            sx: {
                                fontSize: 16,
                                fontWeight: 650
                            }
                        }}
                        onChange={(e) => setName(e.target.value)}
                    // onBlur={() => saveName()}
                    />
                </Box>
                <Stack direction='row' spacing={2}>
                    <CustomNewTaskStatusPicker setStatusForNewTask={setStatus} />
                    <CustomNewTaskTaskTypePicker setNewTaskTaskTypePicker={setTaskType} />
                    <CustomNewTaskPriorityPicker setNewTaskPriority={setPriority} />
                    <CustomNewTaskDueDateTimePicker setNewTaskStartAt={setStartAt} setNewTaskEndAt={setEndAt} />
                    <CustomNewTaskAssigneePicker setNewTaskAssigneePicker={setAssignee} />
                </Stack>

                {/* <DialogContentText>
                    You can set my maximum width and whether to adapt or not.
                </DialogContentText>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                        <InputLabel htmlFor="max-width">maxWidth</InputLabel>
                        <Select
                            autoFocus
                            value={maxWidth}
                            onChange={handleMaxWidthChange}
                            label="maxWidth"
                            inputProps={{
                                name: 'max-width',
                                id: 'max-width',
                            }}
                        >
                            <MenuItem value={false}>false</MenuItem>
                            <MenuItem value="xs">xs</MenuItem>
                            <MenuItem value="sm">sm</MenuItem>
                            <MenuItem value="md">md</MenuItem>
                            <MenuItem value="lg">lg</MenuItem>
                            <MenuItem value="xl">xl</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                            <Switch checked={fullWidth} onChange={handleFullWidthChange} />
                        }
                        label="Full width"
                    />
                </Box> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddNewTask} color="success" variant='contained' size='small'>Add</Button>
                <Button onClick={handleClose} size='small'>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
