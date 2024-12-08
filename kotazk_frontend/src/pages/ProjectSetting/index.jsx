import * as React from 'react';
import * as TablerIcons from '@tabler/icons-react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, Card, Divider, Grid2, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, alpha, useTheme } from '@mui/material';
import CustomManageStatus from '../../components/CustomManageStatusDialog';
import CustomManageTaskType from '../../components/CustomManageTaskType';
import CustomManagePriority from '../../components/CustomManagePriority';
import CustomManageLabel from '../../components/CustomManageLabel';
import CustomBasicTextField from '../../components/CustomBasicTextField';
import { useSelector } from 'react-redux';
import CustomDialogForManage from '../../components/CustomDialogForManage';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import { Link } from 'react-router-dom';
import ProjectMember from '../ProjectMember';
import { getProjectCover } from '../../utils/coverUtil';
import CustomCoverUploader from '../../components/CustomCoverUploader';
import CustomTextFieldWithValidation from '../../components/CustomTextFieldWithValidation';


export default function ProjectSetting() {
    const project = useSelector((state) => state.project.currentProject);
    const [open, setOpen] = React.useState(false);
    const [maxWidth, setMaxWidth] = React.useState("log");
    const [children, setChildren] = React.useState(<CustomManageStatus />);
    const [name, setName] = React.useState(project?.name);
    const [description, setDescription] = React.useState(project?.description);
    const [visibility, setVisibility] = React.useState('PUBLIC');
    const [nameError, setNameError] = React.useState(false);
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [visibilityError, setVisibilityError] = React.useState(false);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const modifyPermission = currentMember?.role?.projectPermissions?.includes("MODIFY_PROJECT");

    const theme = useTheme();
    const MemberIcon = TablerIcons["IconUsers"];
    const RoleIcon = TablerIcons["IconUserCircle"]
    const StatusIcon = TablerIcons["IconPlaystationCircle"];
    const LabelsIcon = TablerIcons["IconTagsFilled"];
    const PriorityIcon = TablerIcons["IconFlag"];
    const TaskTypeIcon = TablerIcons["IconBoxModel2"];
    const SettingIcon = TablerIcons["IconSettings"];
    const AccessIcon = TablerIcons["IconAccessible"];
    const FieldIcon = TablerIcons["IconInputSpark"];
    const ImageIcon = TablerIcons["IconPhoto"];

    React.useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description);
            setVisibility(project.visibility);
        }
    }, [project])

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    return (
        <Stack justifyContent={'center'} height={'100%'} bgcolor={alpha(theme.palette.background.default, 0.5)} borderRadius={2}>
            <Grid2 container spacing={2} overflow={'auto'} height={'100%'} justifyContent={'center'}>
                <Grid2 size={5} overflow={'auto'} height={'100%'}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <Card
                                sx={{
                                    p: 2
                                }}
                            >
                                <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
                                    <ImageIcon size={20} />
                                    <Typography variant='h6' fontWeight={500}>
                                        Cover and Background
                                    </Typography>
                                    <Box flexGrow={1}>
                                        <Divider />
                                    </Box>
                                </Stack>

                                <CustomCoverUploader project={project} />
                            </Card>
                        </Grid2>
                        <Grid2 size={12}>
                            <Card
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    p: 2,
                                    overflowY: 'auto'
                                }}
                            >

                                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                    <SettingIcon size={20} />
                                    <Typography variant='h6' fontWeight={500}>
                                        Basic Settings
                                    </Typography>
                                    <Box flexGrow={1}>
                                        <Divider />
                                    </Box>
                                </Stack>
                                <Box component={'form'}>
                                    <Grid2 container direction={'row'} spacing={2} alignItems={'center'} mt={2}>
                                        <Grid2 size={12}>
                                            <Grid2 container>
                                                <Grid2 size={2}>
                                                    <InputLabel
                                                        htmlFor="name" sx={{
                                                            my: 2,
                                                            '& .MuiInputLabel-asterisk': {
                                                                color: 'red',
                                                            },
                                                        }} required>Name</InputLabel>
                                                </Grid2>
                                                <Grid2 size={10}>
                                                    <Box>
                                                        <CustomTextFieldWithValidation
                                                            disabled={!modifyPermission}
                                                            id="name"
                                                            name="name"
                                                            size="small"
                                                            placeholder='Enter project name'
                                                            fullWidth
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            setFormError={setNameError}
                                                            maxLength={50}
                                                            required
                                                            validationRegex={/^[A-Za-z0-9À-ÿ ]*$/}
                                                            regexErrorText="Only letters, numbers, and spaces are allowed."
                                                            defaultHelperText="Enter the project name. Only letters, numbers, and spaces are allowed."
                                                        />
                                                    </Box>
                                                </Grid2>
                                            </Grid2>
                                        </Grid2>

                                        <Grid2 size={12}>
                                            <Grid2 container>
                                                <Grid2 size={2}>
                                                    <InputLabel
                                                        htmlFor="name" sx={{
                                                            my: 2,
                                                            '& .MuiInputLabel-asterisk': {
                                                                color: 'red',
                                                            },
                                                        }} required>
                                                        Status:
                                                    </InputLabel>
                                                </Grid2>
                                                <Grid2 size={10}>
                                                    <Select
                                                        disabled={!modifyPermission}
                                                        labelId="visibility-label"
                                                        id="visibility"
                                                        name="visibility"
                                                        size='small'
                                                        value={visibility}
                                                        fullWidth
                                                        onChange={handleVisibilityChange}
                                                    >
                                                        <MenuItem value="PUBLIC">Public</MenuItem>
                                                        <MenuItem value="PRIVATE">Private</MenuItem>
                                                    </Select>
                                                </Grid2>
                                            </Grid2>
                                        </Grid2>

                                        <Grid2 size={12}>
                                            <Grid2 container>

                                                <Grid2 size={2}>
                                                    <InputLabel htmlFor="description">Description</InputLabel>
                                                </Grid2>
                                                <Grid2 size={10}>
                                                    <CustomTextFieldWithValidation
                                                        disabled={!modifyPermission}
                                                        id="description"
                                                        name="description"
                                                        size="small"
                                                        placeholder='Enter workspace description'
                                                        value={description}
                                                        onChange={(e) => {
                                                            setDescription(e.target.value);
                                                        }}
                                                        maxLength={200}
                                                        multiline
                                                        required={false}
                                                        rows={5}
                                                    />
                                                </Grid2>

                                            </Grid2>
                                        </Grid2>
                                    </Grid2>
                                    <Stack direction={'row'} width={'100%'} justifyContent={'flex-end'} mt={1}>
                                        <Button variant='contained' size='small' disabled={!modifyPermission}>
                                            Save
                                        </Button>
                                    </Stack>
                                </Box>


                            </Card>
                        </Grid2>
                    </Grid2>

                </Grid2>
                <Grid2 size={3} overflow={'auto'} height={'100%'}>
                    <Card
                        sx={{
                            height: '100%',
                            p: 2
                        }}
                    >
                        <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
                            <AccessIcon size={20} />
                            <Typography variant='h6' fontWeight={500}>
                                Access and members
                            </Typography>
                            <Box flexGrow={1}>
                                <Divider />
                            </Box>
                        </Stack>

                        <Stack spacing={2}>
                            <Button
                                sx={{
                                    p: 2
                                }}
                                color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}
                                fullWidth
                                size='small'
                                variant='outlined'
                                startIcon={<MemberIcon size={18} />}
                                onClick={() => { setMaxWidth("md"); setOpen(true); setChildren(<ProjectMember />); }}
                            >
                                Members Setting
                            </Button>
                            <Button
                                sx={{
                                    p: 2
                                }}
                                component={Link} to={`/project/${project?.id}/role`} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' startIcon={<RoleIcon size={18} />}>
                                Roles Setting
                            </Button>
                        </Stack>

                        <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2} mt={4}>
                            <FieldIcon size={20} />
                            <Typography variant='h6' fontWeight={500} mt={4}>
                                Fields
                            </Typography>
                            <Box flexGrow={1}>
                                <Divider />
                            </Box>
                        </Stack>
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <Stack spacing={2}>
                                <Button
                                    sx={{
                                        p: 2
                                    }}
                                    color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setMaxWidth("md"); setOpen(true); setChildren(<CustomManageStatus />); }} startIcon={<StatusIcon size={18} />}>
                                    Status
                                </Button>
                                <Button
                                    sx={{
                                        p: 2
                                    }}
                                    color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setMaxWidth("md"); setOpen(true); setChildren(<CustomManageTaskType />); }} startIcon={<TaskTypeIcon size={18} />}>
                                    Task type
                                </Button>
                                <Button
                                    sx={{
                                        p: 2
                                    }}
                                    color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setMaxWidth("md"); setOpen(true); setChildren(<CustomManagePriority />); }} startIcon={<PriorityIcon size={18} />}>
                                    Priority
                                </Button>
                                <Button
                                    sx={{
                                        p: 2
                                    }}
                                    color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setMaxWidth("md"); setOpen(true); setChildren(<CustomManageLabel />); }} startIcon={<LabelsIcon size={18} />}>
                                    Label
                                </Button>
                            </Stack>
                            <CustomDialogForManage open={open} setOpen={setOpen} children={children} customMaxWidth={maxWidth} />
                        </Box>
                    </Card>
                </Grid2>
            </Grid2>
        </Stack>
    );
}
