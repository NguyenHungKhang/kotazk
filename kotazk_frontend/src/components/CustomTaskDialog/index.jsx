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
import PriorityComponent from './PriorityComponent';
import StartAndEndDatePicker from './StartAndEndDatePicker';
import CustomStatusPicker from '../CustomStatusPicker';
import CustomTextField from '../CustomBasicTextField';
import CustomBasicTextField from '../CustomBasicTextField';

const CustomTaskDialog = ({ taskData, OpenComponent }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const [task, setTask] = React.useState(taskData)
    const AddIcon = TablerIcons['IconSquarePlus'];
    const ProjectIcon = TablerIcons['IconTableFilled'];
    const [open, setOpen] = React.useState(false);
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

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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

    const SelectedIconComponent = TablerIcons[selectedIcon];

    return (
        <React.Fragment>
            <OpenComponent onClick={handleClickOpen} />
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
                                            <CustomTaskTypePicker />
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
                                            <CustomStatusPicker />
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
                                            <StartAndEndDatePicker />
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
                                            <AssigneesComponent />
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
                                            <PriorityComponent />
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
                                    <LabelComponent />
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
                    </Grid>


                </DialogContent>
            </Dialog>
        </React.Fragment >
    );
}

export default CustomTaskDialog;