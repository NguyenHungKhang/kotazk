import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, Typography, Button, Stack, Grid2, TableHead, Box, useTheme } from '@mui/material';
import AddRoleDialog from './AddRoleDialog';
import * as TablerIcon from '@tabler/icons-react';
import CustomBasicTextField from '../../components/CustomBasicTextField';
import * as apiService from '../../api/index'
import { useDispatch } from 'react-redux';
import { setCurrentMemberRoleList } from '../../redux/actions/memberRole.action';
import { setSnackbar } from '../../redux/actions/snackbar.action';

const RoleTableHeader = ({ roles, editedFlag, handleSavePermissionList, handleOpenDeleteDialog, handleSaveName, name, setName }) => {
    const theme = useTheme();
    return (
        <TableHead>
            <TableCell sx={{ width: 600, position: 'sticky', left: 0, zIndex: 3, borderRight: `4px solid grey` }}>
                <Typography fontWeight={500}>Permission</Typography>
            </TableCell>
            {roles?.map(role => (
                <TableCell key={role.id} sx={{ width: 360, borderRight: '1px solid grey' }}>
                    <RoleHeaderCell roles={roles} role={role} editedFlag={editedFlag} handleSavePermissionList={handleSavePermissionList} handleOpenDeleteDialog={handleOpenDeleteDialog} />
                </TableCell>
            ))}
            <TableCell width={150}>
                <Stack direction={'row'} justifyContent={'center'}>
                    <AddRoleDialog saveMethod={handleSaveName} name={name} setName={setName} />
                </Stack>
            </TableCell>
        </TableHead>
    );
};


const RoleHeaderCell = ({ roles, role, editedFlag, handleSavePermissionList, handleOpenDeleteDialog }) => {
    const SaveIcon = TablerIcon["IconDeviceFloppy"];
    const RemoveIcon = TablerIcon["IconTrash"];
    const dispatch = useDispatch();

    const [name, setName] = useState(null);
    const [editeNameFlag, setEditNameFlag] = useState(false);

    useEffect(() => {
        if (role)
            setName(role.name)
    }, [role])

    const handleSaveName = async () => {
        const response = await apiService.memberRoleAPI.update(role?.id, {
            "name": name,
        });
        if (response?.data) {
            dispatch(setCurrentMemberRoleList(roles.map(existingRole => existingRole.id === role.id ? response.data : existingRole)));
            dispatch(setSnackbar({ content: "Member role update successful!", open: true }));
        }
    }

    return (
        <Grid2 container alignItems={'center'}>
            <Grid2 item size={1}>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-start'}>
                    {!role.systemRequired && editedFlag?.includes(role.id) && (
                        <Button size='small' color='success' variant='contained' onClick={() => handleSavePermissionList(role)} sx={{ p: 1, minWidth: 0 }}>
                            <SaveIcon size={18} />
                        </Button>
                    )}
                </Stack>
            </Grid2>
            <Grid2 item size={10}>
                <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                    {role.systemRequired ?
                        <>
                            <Typography fontWeight={650}
                                noWrap
                            >{role.name}</Typography>
                            <Typography color='error' noWrap>*</Typography>
                        </>
                        :
                        <>
                            {editeNameFlag ?
                                <>
                                    <CustomBasicTextField
                                        size='small'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={() => handleSaveName()}
                                        sx={{
                                            "& input": {
                                                p: 1,
                                                textAlign: 'center'
                                            }
                                        }}
                                    />
                                    {/* <Box>
                                        <Button size='small' color='info' variant='contained' onClick={() => setEditNameFlag(false)} sx={{ p: 1, minWidth: 0 }}>
                                            <SaveIcon size={18} />
                                        </Button>
                                    </Box> */}
                                </>
                                :
                                <Typography
                                    fontWeight={650}
                                    onClick={() => setEditNameFlag(true)}
                                    noWrap
                                >
                                    {name}
                                </Typography>
                            }

                        </>
                    }
                </Stack>
            </Grid2>
            <Grid2 item size={1}>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                    {!role.systemRequired && (
                        <Button size='small' color='error' variant='contained' onClick={() => handleOpenDeleteDialog(role)} sx={{ p: 1, minWidth: 0 }}>
                            <RemoveIcon size={18} />
                        </Button>
                    )}
                </Stack>
            </Grid2>
        </Grid2>
    );
}

export default RoleTableHeader;
