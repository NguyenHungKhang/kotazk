import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, Card, Divider, Grid2, Paper, Stack, TextField, Typography, useTheme } from '@mui/material';
import CustomManageStatus from '../../components/CustomManageStatusDialog';
import CustomManageTaskType from '../../components/CustomManageTaskType';
import CustomManagePriority from '../../components/CustomManagePriority';
import CustomManageLabel from '../../components/CustomManageLabel';
import CustomBasicTextField from '../../components/CustomBasicTextField';
import { useSelector } from 'react-redux';
import CustomDialogForManage from '../../components/CustomDialogForManage';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import { Link } from 'react-router-dom';


export default function ProjectSetting() {
    const [open, setOpen] = React.useState(false);
    const [children, setChildren] = React.useState(<CustomManageStatus />);
    const project = useSelector((state) => state.project.currentProject);
    const theme = useTheme();

    return (

        <Grid2 container spacing={2} height={'100%'}>
            <Grid2 size={8}>
                <Card
                    sx={{
                        height: '100%',
                        p: 2
                    }}
                >
                    <TextField
                        size='small'
                        fullWidth
                        defaultValue={project?.name}
                    />
                </Card>
            </Grid2>
            <Grid2 size={4}>
                <Card
                    sx={{
                        height: '100%',
                        p: 2
                    }}
                >
                    <Typography variant='h6' fontWeight={500}>
                        Access and members
                    </Typography>
                    <Stack spacing={2}>
                        <Button component={Link} to={`/project/${project?.id}/member`} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined'>
                            Members Setting
                        </Button>
                        <Button component={Link} to={`/project/${project?.id}/role`} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined'>
                            Roles Setting
                        </Button>
                    </Stack>


                    <Typography variant='h6' fontWeight={500} mt={4}>
                        Fields
                    </Typography>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Stack spacing={2}>
                            <Button color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setOpen(true); setChildren(<CustomManageStatus />); }}>
                                Status
                            </Button>
                            <Button color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setOpen(true); setChildren(<CustomManageTaskType />); }}>
                                Task type
                            </Button>
                            <Button color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setOpen(true); setChildren(<CustomManagePriority />); }}>
                                Priority
                            </Button>
                            <Button color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} fullWidth size='small' variant='outlined' onClick={() => { setOpen(true); setChildren(<CustomManageLabel />); }}>
                                Label
                            </Button>
                        </Stack>
                        <CustomDialogForManage open={open} setOpen={setOpen} children={children} />
                    </Box>
                </Card>
            </Grid2>
        </Grid2>
    );
}
