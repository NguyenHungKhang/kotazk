import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Checkbox, Grid2, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import { projectPermissionList } from './projectPermissonList';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import * as apiService from '../../api/index';
import * as TablerIcon from '@tabler/icons-react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import AddRoleDialog from './AddRoleDialog';

const permissions = projectPermissionList;

const ProjectRole = () => {
    const theme = useTheme();
    const [roles, setRoles] = useState([]);
    const [editedFlag, setEditedFlag] = useState([]);
    const [name, setName] = useState(null);
    const project = useSelector((state) => state.project.currentProject);
    const SaveIcon = TablerIcon["IconDeviceFloppy"]
    const RemoveIcon = TablerIcon["IconTrash"];
    const dispatch = useDispatch();

    useEffect(() => {
        if (project) fetchRoles();
    }, [project]);

    const fetchRoles = async () => {
        const response = await apiService.memberRoleAPI.getPageByProject({ filters: [] }, project?.id);
        if (response?.data?.content) {
            setRoles(response.data.content);
        }
    };

    const [permissionsState, setPermissionsState] = useState({});

    useEffect(() => {
        if (roles.length > 0) {
            const initialState = roles.reduce((acc, role) => {
                acc[role.id] = {};
                permissions.forEach(({ items }) => {
                    items.forEach(item => {
                        acc[role.id][item.key] = role?.projectPermissions?.includes(item.key);
                    });
                });
                return acc;
            }, {});
            setPermissionsState(initialState);
        }
    }, [roles]);

    const handleCheckboxChange = (roleId, key) => {
        setPermissionsState(prev => ({
            ...prev,
            [roleId]: {
                ...prev[roleId],
                [key]: !prev[roleId][key]
            }
        }));
        setEditedFlag(prev => ([
            ...prev,
            roleId
        ]))
    };

    const handleSaveName = async () => {
        const data = {
            "name": name,
            "projectId": project?.id,
            "roleFor": "PROJECT"
        }
        const response = await apiService.memberRoleAPI.create(data);
        if (response?.data) {
            setRoles([...roles, response.data]);
            dispatch(setSnackbar({
                content: "Role create successful!",
                open: true
            }))
        }
    };

    const handleSavePermissionList = async (role) => {
        const permissionList = permissionsState[role?.id]
        const permissionKeyList = Object.keys(permissionList).filter(k => permissionList[k]);
        const data = {
            "projectPermissions": permissionKeyList
        }
        const response = await apiService.memberRoleAPI.update(role?.id, data);
        if (response?.data) {
            setEditedFlag(prevEditedFlag => prevEditedFlag.filter(ef => ef !== role?.id));
            setRoles(prevRoles =>
                prevRoles.map(existingRole =>
                    existingRole.id === role.id ? response.data : existingRole
                )
            );
            dispatch(setSnackbar({
                content: "Role update successful!",
                open: true
            }))
        }
    };


    return (
        <Box
            sx={{
                height: '100%'
            }}
        >
            <Card sx={{ height: '100%', overflowY: 'hidden', overflowX: 'auto', p: 2 }}>
                <TableContainer maxHeight={'100%'} component={Box}>
                    <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        width: 600,
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 3,
                                        backgroundColor: theme.palette.background.paper,
                                        borderRight: '1px solid grey'
                                    }}
                                >
                                    Permission
                                </TableCell>
                                {roles.map(role => (
                                    <TableCell key={role.id} sx={{ width: 200, borderRight: '1px solid grey' }}>
                                        <Grid2 container alignItems={'center'}>
                                            <Grid2 item size={4}>
                                                <Stack direction={'row'} spacing={1} justifyContent={'flex-start'}>
                                                    {(!role.systemRequired && editedFlag?.includes(role?.id)) && (
                                                        <Box>
                                                            <Button
                                                                size='small'
                                                                color={'success'}
                                                                variant='contained'
                                                                onClick={() => handleSavePermissionList(role)}
                                                                sx={{
                                                                    p: 1,
                                                                    minWidth: 0
                                                                }}
                                                            ><SaveIcon size={18} /></Button>
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </Grid2>
                                            <Grid2 item size={4}>
                                                <Stack direction={'row'} spacing={1} justifyContent={'center'}>
                                                    <Typography>{role.name}</Typography>
                                                    {role.systemRequired && (<Typography color='error' noWrap>*</Typography>)}
                                                </Stack>

                                            </Grid2>
                                            <Grid2 item size={4}>
                                                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                                                    {!role.systemRequired && (
                                                        <Box>
                                                            <Button
                                                                size='small'
                                                                color={'error'}
                                                                variant='contained'
                                                                sx={{
                                                                    p: 1,
                                                                    minWidth: 0
                                                                }}
                                                            ><RemoveIcon size={18} /></Button>
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </Grid2>
                                        </Grid2>
                                    </TableCell>
                                ))}
                                <TableCell width={100}>
                                    <AddRoleDialog saveMethod={handleSaveName} name={name} setName={setName} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permissions.map(({ group, items }) => (
                                <React.Fragment key={group}>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 1,
                                                fontWeight: 'bold',
                                                backgroundColor: getSecondBackgroundColor(theme)
                                            }}
                                        >
                                            {group}
                                        </TableCell>
                                        <TableCell
                                            colSpan={roles.length + 1}
                                            sx={{
                                                backgroundColor: getSecondBackgroundColor(theme)
                                            }}
                                        >
                                        </TableCell>
                                    </TableRow>
                                    {items.map(({ key, title, description }) => (
                                        <TableRow key={key}>
                                            <TableCell
                                                sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 1,
                                                    bgcolor: theme.palette.background.paper,
                                                    borderRight: '1px solid grey'
                                                }}
                                            >
                                                <Typography fontWeight={650}>{title}</Typography>
                                                <Typography>{description}</Typography>
                                            </TableCell>
                                            {roles.map(role => (
                                                <TableCell key={`${role.id}-${key}`} sx={{ borderRight: '1px solid grey' }}>
                                                    <Stack alignItems={'center'} justifyContent={'center'}>
                                                        <Checkbox
                                                            size='small'
                                                            disableRipple={role.systemRequired}
                                                            readOnly={role.systemRequired}
                                                            checked={permissionsState[role.id]?.[key] || false}
                                                            onChange={() => !role.systemRequired && handleCheckboxChange(role.id, key)}
                                                            color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                                                            sx={{
                                                                cursor: role.systemRequired && "not-allowed"
                                                            }}
                                                        />
                                                    </Stack>
                                                </TableCell>
                                            ))}
                                            <TableCell>
                                                <Stack alignItems={'center'} justifyContent={'center'}>
                                                    -
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box >
    );
};

export default ProjectRole;
