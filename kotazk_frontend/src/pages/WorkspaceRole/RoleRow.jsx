import React from 'react';
import { TableCell, TableRow, Typography, Stack, useTheme } from '@mui/material';
import PermissionCheckbox from './PermissionCheckbox';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import { useSelector } from 'react-redux';

const RoleRow = ({ item, roles, permissionsState, handleCheckboxChange }) => {
    const theme = useTheme();
    const currentMember = useSelector((state) => state.member.currentWorkspaceMember);

    const roleManagePermission = currentMember?.role?.workSpacePermissions?.includes("MANAGE_ROLE");
    return (
        <TableRow key={item.key}>
            <TableCell sx={{ position: 'sticky', left: 0, bgcolor: getCustomTwoModeColor(theme, "#fff", "#1e1e1e"), zIndex: 1, borderRight: `4px solid grey` }}>
                <Typography fontWeight={650}>{item.title}</Typography>
                <Typography>{item.description}</Typography>
            </TableCell>
            {roles?.map(role => (
                <TableCell key={`${role.id}-${item.key}`} sx={{ borderRight: '1px solid grey' }}>
                    <PermissionCheckbox
                        role={role}
                        keyName={item.key}
                        checked={permissionsState[role.id]?.[item.key] || false}
                        handleChange={() => !role.systemRequired && handleCheckboxChange(role.id, item.key)}
                    />
                </TableCell>
            ))}
            {roleManagePermission && (
                <TableCell>
                    <Stack alignItems={'center'} justifyContent={'center'}>-</Stack>
                </TableCell>
            )}

        </TableRow>
    );
}
export default RoleRow;
