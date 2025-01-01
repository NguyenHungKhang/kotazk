import React from 'react';
import { Checkbox, Stack, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const PermissionCheckbox = ({ role, keyName, checked, handleChange }) => {
    const theme = useTheme();
    const currentMember = useSelector((state) => state.member.currentWorkspaceMember);

    const roleManagePermission = currentMember?.role?.workSpacePermissions?.includes("MANAGE_ROLE");
    return (
        <Stack alignItems={'center'} justifyContent={'center'}>
            <Checkbox
                size='small'
                disableRipple={role.systemRequired || !roleManagePermission}
                readOnly={role.systemRequired || !roleManagePermission}
                checked={checked}
                onChange={() => {
                    if (roleManagePermission)
                        handleChange();
                }}
                color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}
                sx={{ cursor: (role.systemRequired || !roleManagePermission) && "not-allowed" }}
            />
        </Stack>
    );
}
export default PermissionCheckbox;
