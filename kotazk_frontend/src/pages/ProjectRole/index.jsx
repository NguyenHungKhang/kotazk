import React, { useEffect, useState } from 'react';
import { Box, Card, Table, TableContainer, useTheme } from '@mui/material';
import { projectPermissionList } from './projectPermissonList';
import { useSelector, useDispatch } from 'react-redux';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { setCurrentMemberRoleList } from '../../redux/actions/memberRole.action';
import { setDeleteDialog } from '../../redux/actions/dialog.action';
import * as apiService from '../../api/index';
import RoleTableHeader from './RoleTableHeader';
import RoleTableBody from './RoleTableBody';

const permissions = projectPermissionList;

const ProjectRole = () => {
    const theme = useTheme();
    const roles = useSelector(state => state.memberRole.currentMemberRoleList);
    const project = useSelector(state => state.project.currentProject);
    const dispatch = useDispatch();
    const [permissionsState, setPermissionsState] = useState({});
    const [editedFlag, setEditedFlag] = useState([]);
    const [name, setName] = useState(null);

    useEffect(() => {
        if (project) fetchRoles();
    }, [project]);

    const fetchRoles = async () => {
        const response = await apiService.memberRoleAPI.getPageByProject({
            filters: [],
            sortBy: 'position',
            sortDirectionAsc: true
        }, project?.id);

        if (response?.data?.content) {
            dispatch(setCurrentMemberRoleList(response.data.content));
        }
    };

    useEffect(() => {
        if (roles != null && roles.length > 0) {
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
        ]));
    };

    const handleSavePermissionList = async (role) => {
        const permissionList = permissionsState[role?.id];
        const permissionKeyList = Object.keys(permissionList).filter(k => permissionList[k]);
        const response = await apiService.memberRoleAPI.update(role?.id, { "projectPermissions": permissionKeyList });
        if (response?.data) {
            setEditedFlag(prevEditedFlag => prevEditedFlag.filter(ef => ef !== role?.id));
            dispatch(setCurrentMemberRoleList(roles.map(existingRole => existingRole.id === role.id ? response.data : existingRole)));
            dispatch(setSnackbar({ content: "Role update successful!", open: true }));
        }
    };

    const handleSaveName = async () => {
        const response = await apiService.memberRoleAPI.create({
            "name": name,
            "projectId": project?.id,
            "roleFor": "PROJECT"
        });
        if (response?.data) {
            dispatch(setCurrentMemberRoleList([...roles, response.data]));
            dispatch(setSnackbar({ content: "Role create successful!", open: true }));
        }
    };

    const handleOpenDeleteDialog = (role) => {
        dispatch(setDeleteDialog({
            title: `Delete role "${role?.name}"?`,
            content: `You're about to permanently delete this role.<br/><br/>Are you sure you want to delete it?`,
            open: true,
            deleteType: "DELETE_ROLE",
            deleteProps: { roleId: role?.id }
        }));
    };

    return roles == null ? <>Loading...</> : (
        <Box sx={{ height: '100%' }}>
            <Card sx={{ height: '100%', overflowY: 'hidden', overflowX: 'auto'}}>
                <TableContainer maxHeight={'100%'} component={Box}>
                    <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                        <RoleTableHeader
                            roles={roles}
                            editedFlag={editedFlag}
                            handleSavePermissionList={handleSavePermissionList}
                            handleOpenDeleteDialog={handleOpenDeleteDialog}
                            handleSaveName={handleSaveName}
                            name={name}
                            setName={setName}
                        />
                        <RoleTableBody
                            permissions={permissions}
                            roles={roles}
                            permissionsState={permissionsState}
                            handleCheckboxChange={handleCheckboxChange}
                            theme={theme}
                        />
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default ProjectRole;
