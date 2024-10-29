import { Box, Card, DialogActions, Divider, IconButton, Paper, Skeleton, Slide, Stack, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid2 from '@mui/material/Grid2';
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
import CommentAndActivitySection from './CommentAndActivitySection';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});


const CustomTaskDialog = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const { task, open } = useSelector((state) => state.dialog.taskDialog);
    const tasks = useSelector((state) => state.task.currentTaskList)


    const AddIcon = TablerIcons['IconSquarePlus'];
    const ProjectIcon = TablerIcons['IconTableFilled'];
    const CloseDialogIcon = TablerIcons['IconArrowBarRight'];


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
    const TaskTypeIcon = TablerIcons["IconBoxModel2"];
    const DashedOutlinedCheckCircleIcon = TablerIcons["IconCircleDashedCheck"];
    const FilledCheckCircleIcon = TablerIcons["IconCircleCheckFilled"];


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
            // maxWidth='md'
            open={open}
            onClose={handleClose}
            hideBackdrop={true}
            TransitionComponent={Transition}
            PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    await saveProject();
                    handleClose();
                },
                sx: {
                    bgcolor: `${theme.palette.background.default} !important`,
                    boxShadow: 0,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100vh',  // Full viewport height
                    maxHeight: '100vh',  // Ensure it doesn't exceed viewport height
                    margin: 0,  // Remove any margin
                    maxWidth: 800,
                    padding: 0,  // Remove any padding
                    borderRadius: 0,  // Remove border-radius to make it flush with edges
                    transform: 'none',  // Prevent default MUI positioning transform
                    borderLeft: '1px solid grey'
                }
            }}
        >
            <DialogTitle
                sx={{
                    position: 'sticky',
                    top: 0,
                    p: 0,
                    bgcolor: theme.palette.mode == "light" ? 'white' : '#1e1e1e',
                    zIndex: 1, // Ensure it's on top of the content
                }}
            >
                <Box
                    sx={{
                        p: 4
                    }}
                >
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Box flexGrow={1}>
                            <Button color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'} variant='outlined' size='small'

                                startIcon={task?.isCompleted ? <FilledCheckCircleIcon /> : <DashedOutlinedCheckCircleIcon />}
                            >
                                Complete task
                            </Button>
                        </Box>
                        <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-end'>
                            <IconButton onClick={() => handleClose()} size='small'>
                                <CloseDialogIcon size={20} stroke={2} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{
                    bgcolor: theme.palette.mode == "light" ? 'white' : '#1e1e1e',
                }}

            >

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
                <Stack direction={'column'} spacing={1} mt={2} p={2} borderRadius={2} bgcolor={getSecondBackgroundColor(theme)}>
                    <Card
                        sx={{
                            px: 2,
                            py: 1,
                            my: 0.5,
                            boxShadow: 0
                        }}
                    >
                        <Grid2 container spacing={1}>
                            <Grid2 item size={3} display='flex' alignItems='center'>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <TaskTypeIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography pt={0.5} variant='body2' color={theme.palette.text.secondary}>
                                        Task type
                                    </Typography>
                                </Stack>

                            </Grid2>
                            <Grid2 item size={9}>
                                <CustomTaskTypePicker currentTaskType={task?.taskType} taskId={task?.id} />
                            </Grid2>
                        </Grid2>
                    </Card>

                    <Card
                        sx={{
                            px: 2,
                            py: 1,
                            my: 0.5,
                            boxShadow: 0
                        }}
                    >
                        <Grid2 container spacing={1}>
                            <Grid2 item size={3} display='flex' alignItems='center'>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <StatusIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography pt={0.5} variant='body2' color={theme.palette.text.secondary}>
                                        Status
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 item size={9}>
                                <CustomStatusPicker currentStatus={task?.status} taskId={task?.id} />
                            </Grid2>
                        </Grid2>
                    </Card>

                    <Card
                        sx={{
                            px: 2,
                            py: 1,
                            my: 0.5,
                            boxShadow: 0
                        }}
                    >
                        <Grid2 container spacing={1}>
                            <Grid2 item size={3} display='flex' alignItems='center'>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <DateIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography pt={0.5} variant='body2' color={theme.palette.text.secondary}>
                                        Date
                                    </Typography>
                                </Stack>

                            </Grid2>
                            <Grid2 item size={9}>
                                <CustomDueTimePicker startAt={task?.startAt} endAt={task?.endAt} taskId={task?.id} />
                            </Grid2>
                        </Grid2>
                    </Card>

                    <Card
                        sx={{
                            px: 2,
                            py: 1,
                            my: 0.5,
                            boxShadow: 0
                        }}
                    >
                        <Grid2 container spacing={1}>
                            <Grid2 item size={3} display='flex' alignItems='center'>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <TimeEstimateIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography pt={0.5} variant='body2' color={theme.palette.text.secondary}>
                                        Time Estimate
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 item size={9}>
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
                            </Grid2>
                        </Grid2>
                    </Card>
                    <Card
                        sx={{
                            px: 2,
                            py: 1,
                            my: 0.5,
                            boxShadow: 0
                        }}
                    >
                        <Grid2 container spacing={1}>
                            <Grid2 item size={3} display='flex' alignItems='center'>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <AssigneeIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography variant='body2' pt={0.5} color={theme.palette.text.secondary}>
                                        Assignee
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 item size={9}>
                                <CustomAssigneePicker currentAssignee={task?.assignee} taskId={task?.id} />
                            </Grid2>
                        </Grid2>
                    </Card>
                    {/* <Grid2 item size={3}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <ReporterIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography variant='body2' pt={0.5}>
                                        Reporter
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 item size={9}>
                                <AssigneesComponent />
                            </Grid2>
                            <Grid2 item size={3}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <CollaboratorsIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography variant='body2' pt={0.5}>
                                        Collaborators
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 item size={9}>
                                <AssigneesComponent />
                            </Grid2> */}
                    <Card
                        sx={{
                            px: 2,
                            py: 1,
                            my: 0.5,
                            boxShadow: 0
                        }}
                    >
                        <Grid2 container spacing={1}>
                            <Grid2 item size={3} display='flex' alignItems='center'>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <PriorityIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                    <Typography variant='body2' pt={0.5} color={theme.palette.text.secondary}>
                                        Priority
                                    </Typography>
                                </Stack>
                            </Grid2>
                            <Grid2 item size={9}>
                                {/* <PriorityComponent /> */}
                                <CustomPriorityPicker priorityId={task?.priorityId} taskId={task?.id} />
                            </Grid2>

                            {/* <Grid2 item size={3}>
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                                <LinkedTasksIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                                <Typography variant='body2' pt={0.5}>
                                                    Linked Tasks
                                                </Typography>
                                            </Stack>
                                        </Grid2>
                                        <Grid2 item size={9}>
                                            <TextField
                                                required
                                                size="small"
                                                id="time_estimate"
                                                name="time_estimate"
                                                fullWidth
                                                variant="outlined"
                                            />
                                        </Grid2> */}
                        </Grid2>
                    </Card>
                    <Grid2 container spacing={2} mt={4}>
                        <Grid2 item size={2}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <LabelsIcon size={16} stroke={2} color={theme.palette.text.secondary} />
                                <Typography pt={0.5} variant='body2' color={theme.palette.text.secondary}>
                                    Labels
                                </Typography>
                            </Stack>
                        </Grid2>
                        <Grid2 item size={10}>
                            {/* <LabelComponent /> */}
                            <CustomLabelPicker currentLabelList={task?.labels} taskId={task?.id} />
                        </Grid2>
                    </Grid2>
                </Stack>
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
                        {/* <CustomLongTextEditor /> */}
                    </Box>
                </Box>

                {/* <Box mt={6}>
                    <Typography variant='h6' fontWeight={650}>
                        Custom Fields
                    </Typography>
                    <Grid2 container mt={2}>
                        <Grid2
                            item
                            borderRadius={"8px 0 0 0 "}
                            size={3}
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
                        </Grid2>
                        <Grid2
                            item
                            size={9}
                            borderRadius={"0 8px 0 0"}
                            border="1px solid"
                            borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                            borderLeft='none'
                            p={2}
                        >
                            Value
                        </Grid2>

                        <Grid2
                            item
                            // borderRadius={"8px 0 0 0 "}
                            size={3}
                            border="1px solid"
                            borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                            borderTop='none'
                            p={2}
                        >
                            Field 2
                        </Grid2>
                        <Grid2
                            item
                            size={9}
                            // borderRadius={"0 8px 0 0"}
                            border="1px solid"
                            borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                            borderTop='none'
                            borderLeft='none'
                            p={2}
                        >
                            Value 2
                        </Grid2>

                        <Grid2
                            item
                            borderRadius={"0 0 0 8px "}
                            size={3}
                            border="1px solid"
                            borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                            borderTop='none'
                            p={2}
                        >
                            Field 3
                        </Grid2>
                        <Grid2
                            item
                            size={9}
                            borderRadius={"0 0 8px 0"}
                            border="1px solid"
                            borderColor={theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]}
                            borderLeft='none'
                            borderTop='none'
                            p={2}
                        >
                            Value 3
                        </Grid2>
                    </Grid2>
                </Box> */}

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

                {/* <Grid2 item size={5}>
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

                    </Grid2> */}



            </DialogContent >
            <Divider />
            {/* <DialogActions
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1, // Ensure it's on top of the content
                    justifyContent: 'space-between', // Space between footer elements
                    padding: '16px', // Optional padding
                }}
            >
                <CommentAndActivitySection />
            </DialogActions> */}
        </Dialog >
    );
}

export default CustomTaskDialog;