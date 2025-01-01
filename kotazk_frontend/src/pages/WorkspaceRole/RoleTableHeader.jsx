import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, Typography, Button, Stack, Grid2, TableHead, Box, useTheme } from '@mui/material';
import AddRoleDialog from './AddRoleDialog';
import * as TablerIcon from '@tabler/icons-react';
import CustomBasicTextField from '../../components/CustomBasicTextField';
import * as apiService from '../../api/index'
import { useDispatch } from 'react-redux';
import { setCurrentMemberRoleList } from '../../redux/actions/memberRole.action';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { useSelector } from 'react-redux';

const RoleTableHeader = ({ roles, editedFlag, handleSavePermissionList, handleOpenDeleteDialog, handleSaveName, name, setName }) => {
    const theme = useTheme();
    const currentMember = useSelector((state) => state.member.currentWorkspaceMember);

    const roleManagePermission = currentMember?.role?.workSpacePermissions?.includes("MANAGE_ROLE");
    return (
        <TableHead>
            <TableCell sx={{ width: 400, position: 'sticky', left: 0, zIndex: 3, borderRight: `4px solid grey` }}>
                <Typography fontWeight={500}>Permission</Typography>
            </TableCell>
            {roles?.map(role => (
                <TableCell key={role.id} sx={{ width: 360, borderRight: '1px solid grey' }}>
                    <RoleHeaderCell roles={roles} role={role} editedFlag={editedFlag} handleSavePermissionList={handleSavePermissionList} handleOpenDeleteDialog={handleOpenDeleteDialog} />
                </TableCell>
            ))}
            {roleManagePermission && (
                <TableCell width={150}>
                    <Stack direction={'row'} justifyContent={'center'}>
                        <AddRoleDialog saveMethod={handleSaveName} name={name} setName={setName} />
                    </Stack>
                </TableCell>
            )}

        </TableHead>
    );
};


const RoleHeaderCell = ({ roles, role, editedFlag, handleSavePermissionList, handleOpenDeleteDialog }) => {
    const SaveIcon = TablerIcon["IconDeviceFloppy"];
    const RemoveIcon = TablerIcon["IconTrash"];
    const MoveLeft = TablerIcon["IconChevronLeft"];
    const MoveRight = TablerIcon["IconChevronRight"];
    const dispatch = useDispatch();
    const workspace = useSelector((state) => state.workspace.currentWorkspace)
    const currentMember = useSelector((state) => state.member.currentWorkspaceMember);

    const roleManagePermission = currentMember?.role?.workSpacePermissions?.includes("MANAGE_ROLE");

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

    const reposition = async (direction) => {
        // const index = roles.findIndex(r => r.id === role.id);
        // if (index === -1) return;

        // let updatedRoles = [...roles];
        // let nextRoleId;
        // let previousRoleId;

        // if (direction == 'left' && index > 2) {
        //     const temp = updatedRoles[index - 1];
        //     updatedRoles[index - 1] = updatedRoles[index];
        //     updatedRoles[index] = temp;
        //     nextRoleId = temp.id;
        //     previousRoleId = updatedRoles[index - 2].id;

        // } else if (direction === 'right' && index < updatedRoles.length - 1) {
        //     const temp = updatedRoles[index + 1];
        //     updatedRoles[index + 1] = updatedRoles[index];
        //     updatedRoles[index] = temp;
        //     nextRoleId = index + 2 >= updatedRoles.length - 1 ? null : updatedRoles[index + 2].id;
        //     previousRoleId = temp.id;
        // }
        // dispatch(setCurrentMemberRoleList(updatedRoles));
        // const response = await apiService.memberRoleAPI.reposition({
        //     "currentItemId": role.id,
        //     "nextItemId": nextRoleId,
        //     "previousItemId": previousRoleId
        // }, project?.id)

        // if (response?.data)
        //     dispatch(setSnackbar({ content: "Member role update successful!", open: true }));
    }

    return (
        <Grid2 container alignItems={'center'} justifyContent={'center'}>
            {roleManagePermission && (
                <Grid2 item size={2}>
                    <Stack direction={'row'} spacing={1} justifyContent={'flex-start'}>
                        {!role.systemRequired && (
                            <Button size='small' color='info' variant='contained' sx={{ p: 1, minWidth: 0 }} onClick={() => reposition("left")} disabled={roles[3].id === role.id}>
                                <MoveLeft size={18} />
                            </Button>
                        )}
                        {!role.systemRequired && editedFlag?.includes(role.id) && (
                            <Button size='small' color='success' variant='contained' onClick={() => handleSavePermissionList(role)} sx={{ p: 1, minWidth: 0 }}>
                                <SaveIcon size={18} />
                            </Button>

                        )}
                    </Stack>
                </Grid2>
            )}

            <Grid2 item size={8}>
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
                            {(editeNameFlag && roleManagePermission) ?
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
            {roleManagePermission && (
                <Grid2 item size={2}>
                    <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                        {!role.systemRequired && (
                            <>

                                <Button size='small' color='error' variant='contained' onClick={() => handleOpenDeleteDialog(role)} sx={{ p: 1, minWidth: 0 }}>
                                    <RemoveIcon size={18} />
                                </Button>
                                <Button size='small' color='info' variant='contained' sx={{ p: 1, minWidth: 0 }} onClick={() => reposition("right")} disabled={roles.at(-1).id === role.id}>
                                    <MoveRight size={18} />
                                </Button>
                            </>

                        )}
                    </Stack>
                </Grid2>
            )}

        </Grid2>
    );
}

export default RoleTableHeader;
