import React from 'react';
import { Checkbox, Stack, useTheme } from '@mui/material';

const PermissionCheckbox = ({ role, keyName, checked, handleChange }) => {
    const theme = useTheme();
    return (
        <Stack alignItems={'center'} justifyContent={'center'}>
            <Checkbox
                size='small'
                disableRipple={role.systemRequired}
                readOnly={role.systemRequired}
                checked={checked}
                onChange={handleChange}
                color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}
                sx={{ cursor: role.systemRequired && "not-allowed" }}
            />
        </Stack>
    );
}
export default PermissionCheckbox;
