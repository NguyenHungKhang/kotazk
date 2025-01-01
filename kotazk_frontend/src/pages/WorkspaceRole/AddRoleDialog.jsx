import React, { useState } from 'react';
import { Box, Button, Popover, Stack, TextField, Typography, useTheme } from '@mui/material';

function AddRoleDialog({ saveMethod, name, setName }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSave = () => {
        saveMethod();
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button
                variant='contained'
                color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                size='small'
                onClick={handleClick}
                sx={{
                    textWrap: 'nowrap'
                }}
            >
                Add Role
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box p={2}>
                    <Typography mb={2} fontWeight={650}>
                        Add new role
                    </Typography>
                    <Stack direction={'row'} spacing={1}>
                        <TextField
                            size='small'
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <Button size='small' variant="contained" color="success" onClick={handleSave} disabled={(name == null || name?.trim() == "")}>
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Popover>
        </div>
    );
}

export default AddRoleDialog;
