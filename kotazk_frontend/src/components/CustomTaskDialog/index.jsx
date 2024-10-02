import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import * as TablerIcons from '@tabler/icons-react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as apiService from '../../api/index';
import { setCurrentProjectList } from '../../redux/actions/project.action';
import CustomFileUploader from '../CustomFileUploader';
import CustomLongTextEditor from '../CustomLongTextEditor';
import CustomStatusColorIconPicker from '../CustomStatusColorIconPicker';
import CustomTaskTypePicker from '../CustomTaskTypePicker';
import AssigneesComponent from './AssigneesComponent';
import LabelComponent from './LabelComponent';
import CustomStatusPicker from '../CustomStatusPicker';
import CustomTextField from '../CustomBasicTextField';
import CustomBasicTextField from '../CustomBasicTextField';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import { setCurrentTaskList } from '../../redux/actions/task.action';
import { updateAndAddArray } from '../../utils/arrayUtil';
import CustomPriorityPicker from '../CustomPrirorityPicker';
import CustomDueTimePicker from '../CustomDueTimePicker';
import CustomLabelPicker from '../CustomLabelPicker';
import CustomAssigneePicker from '../CustomAssigneePicker';
import { getSecondBackgroundColor } from '../../utils/themeUtil';

const CustomTaskDialog = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const { task, open } = useSelector((state) => state.dialog.taskDialog);
    const tasks = useSelector((state) => state.task.currentTaskList)
    const AddIcon = TablerIcons['IconSquarePlus'];
    const ProjectIcon = TablerIcons['IconTableFilled'];
    const [selectedIcon, setSelectedIcon] = React.useState('IconHome');  // Default icon
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    const StatusIcon = TablerIcons["IconPlaystationCircle"];
    const DateIcon = TablerIcons["IconCalendarDue"];
    const TimeEstimateIcon = TablerIcons["IconHourglass"];
    const LabelsIcon = TablerIcons["IconTagsFilled"];
    const AssigneeIcon = TablerIcons["IconUserFilled"];
    const ReporterIcon = TablerIcons["IconUser"];
    const CollaboratorsIcon = TablerIcons["IconUsers"];
    const PriorityIcon = TablerIcons["IconFlag"]
    const LinkedTasksIcon = TablerIcons["IconHierarchy"];
    const TaskTypeIcon = TablerIcons["IconBoxModel2"]

    const handleClose = () => {
        const taskDialogData = {
            open: false,
            task: null
        }
        dispatch(setTaskDialog(taskDialogData));
    };

    const saveProject = async () => {
        const data = {
            "name": name,
            "description": description,
            "visibility": visibility,
            "workspaceId": workspace.id
        }
        console.log(data);
        await apiService.projectAPI.create(data)
            .then(async (workspaceRes) => {
                const data = {
                    'filters': [

                    ]
                };
                await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
                    .then(projectListRes => { console.log(projectListRes); dispatch(setCurrentProjectList(projectListRes.data)); })
                    .catch(projectListErr => console.log(projectListErr))
            })
            .catch(workspaceErr => console.error(workspaceErr));
    }

    const saveName = async () => {
        const data = {
            "name": name,
        }

        try {
            const response = await apiService.taskAPI.update(task.id, data);
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

    const SelectedIconComponent = TablerIcons[selectedIcon];

    return (
        <Dialog
            fullWidth
            maxWidth='xl'
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    await saveProject();
                    handleClose();
                },
            }}
        >
            <DialogTitle>
                {/* <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item container alignItems="center" xs={10}>
                            <CustomBreadcrumb />
                        </Grid>
                        <Grid item xs={2} container justifyContent="flex-end">
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid> */}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <Box>
                            <CustomBasicTextField
                                required
                                defaultValue={task?.name}
                                size="small"
                                id="name"
                                name="name"
                                fullWidth
                                placeholder='Name of task...'
                                InputProps={{
                                    sx: {
                                        fontSize: 20,
                                        fontWeight: 650
                                    }
                                }}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={() => saveName()}
                            />
                        </Box>
                        <Box mt={6}>
                            <Typography
                                variant='h6'
                                fontWeight={650}
                                sx={{
                                    mb: 1
                                }}
                            >
                                Attributes
                            </Typography>

                            <Grid container spacing={2} >
                                <Grid item xs={6}>
                                    <Grid container spacing={0.5} alignItems='center'>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <TaskTypeIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Task type
                                                </Typography>
                                            </Stack>

                                        </Grid>
                                        <Grid item xs={8}>
                                            <CustomTaskTypePicker taskTypeId={task?.taskTypeId} taskId={task?.id} />
                                        </Grid>
                                        <Grid item xs={4} display='flex' alignItems='center'>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <StatusIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Status
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <CustomStatusPicker statusId={task?.statusId} taskId={task?.id} />
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <DateIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Date
                                                </Typography>
                                            </Stack>

                                        </Grid>
                                        <Grid item xs={8}>
                                            <CustomDueTimePicker startAt={task?.startAt} endAt={task?.endAt} taskId={task?.id} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <TimeEstimateIcon size={16} stroke={2} />
                                                <Typography pt={0.5}>
                                                    Time Estimate
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                inputProps={{ type: 'number' }}
                                                size="small"
                                                id="time_estimate"
                                                name="time_estimate"
                                                fullWidth
                                                placeholder='Empty'
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        py: 0,  // Removes padding inside the root container
                                                        '& .MuiSelect-select': {
                                                            py: 1,
                                                            px: 1,  // Removes padding between value and border
                                                            minHeight: 'auto',  // Resets the default min height
                                                            lineHeight: 'normal',  // Adjusts line height to prevent extra space
                                                        },
                                                        '& fieldset': {
                                                            borderColor: 'transparent !important',
                                                        },
                                                        '&:hover fieldset': {
                                                            bgcolor: theme.palette.action.hover
                                                        },
                                                        '&:focus fieldset': {
                                                            bgcolor: theme.palette.action.focus
                                                        },
                                                        '& .MuiSelect-icon': {
                                                            display: 'none',  // Hides the arrow icon
                                                        },
                                                    },
                                                }}

                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <AssigneeIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Assignee
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <CustomAssigneePicker memberId={task?.assigneeId} taskId={task?.id} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <ReporterIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Reporter
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <AssigneesComponent />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <CollaboratorsIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Collaborators
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <AssigneesComponent />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <PriorityIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Priority
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            {/* <PriorityComponent /> */}
                                            <CustomPriorityPicker priorityId={task?.priorityId} taskId={task?.id} />
                                        </Grid>
                                        {/* <Grid item xs={4}>
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                                <LinkedTasksIcon size={16} stroke={2} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Linked Tasks
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                size="small"
                                                id="time_estimate"
                                                name="time_estimate"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid> */}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={2}>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <LabelsIcon size={16} stroke={2} />
                                        <Typography pt={0.5}>
                                            Labels
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={10}>
                                    {/* <LabelComponent /> */}
                                    <CustomLabelPicker labelIds={task?.labels.map(label => label.labelId)} taskId={task?.id} />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mt={6}>
                            <Typography
                                variant='h6'
                                fontWeight={650}
                                sx={{
                                    mb: 1
                                }}
                            >
                                Description
                            </Typography>
                            <Box
                                mt={2}
                                bgcolor={theme.palette.mode === "light" ? "#fff" : '#1F1F1F'}
                                border="1px solid"
                                borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                minHeight={100}
                                borderRadius={2}
                            >
                                <CustomLongTextEditor />
                            </Box>
                        </Box>

                        <Box mt={6}>
                            <Typography variant='h6' fontWeight={650}>
                                Custom Fields
                            </Typography>
                            <Grid container mt={2}>
                                <Grid
                                    item
                                    borderRadius={"8px 0 0 0 "}
                                    xs={4}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    p={2}
                                >
                                    <CustomBasicTextField
                                        size='small'
                                        contentEditable={false}
                                        fullWidth
                                        placeholder='Name of field...'
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={8}
                                    borderRadius={"0 8px 0 0"}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    borderLeft='none'
                                    p={2}
                                >
                                    Value
                                </Grid>

                                <Grid
                                    item
                                    // borderRadius={"8px 0 0 0 "}
                                    xs={4}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    borderTop='none'
                                    p={2}
                                >
                                    Field 2
                                </Grid>
                                <Grid
                                    item
                                    xs={8}
                                    // borderRadius={"0 8px 0 0"}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    borderTop='none'
                                    borderLeft='none'
                                    p={2}
                                >
                                    Value 2
                                </Grid>

                                <Grid
                                    item
                                    borderRadius={"0 0 0 8px "}
                                    xs={4}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    borderTop='none'
                                    p={2}
                                >
                                    Field 3
                                </Grid>
                                <Grid
                                    item
                                    xs={8}
                                    borderRadius={"0 0 8px 0"}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    borderLeft='none'
                                    borderTop='none'
                                    p={2}
                                >
                                    Value 3
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mt={6}>
                            <Typography variant='h6' fontWeight={650}>
                                Subtasks
                            </Typography>
                            <Stack mt={2}>
                                <Box
                                    flexGrow={1}
                                    borderRadius={"8px 8px 0 0"}
                                    border="1px solid"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    p={2}
                                >
                                    Test 1
                                </Box>
                                <Box
                                    flexGrow={1}
                                    borderRadius={"0 0 8px 8px"}
                                    border="1px solid"
                                    borderTop="none"
                                    borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                                    p={2}
                                >
                                    Test 2
                                </Box>
                            </Stack>
                        </Box>

                        <Box mt={6}>
                            <Typography variant='h6' fontWeight={650}>
                                Attachments
                            </Typography>
                            <Box>
                                <CustomFileUploader />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <Box
                            bgcolor={getSecondBackgroundColor(theme)}
                            height='100%'
                            borderRadius={4}
                            p={4}
                        >
                            <Typography variant="h4">
                                Comment And Activity log: Upcomming...
                            </Typography>
                        </Box>

                    </Grid>
                </Grid>


            </DialogContent>
        </Dialog>
    );
}

export default CustomTaskDialog;