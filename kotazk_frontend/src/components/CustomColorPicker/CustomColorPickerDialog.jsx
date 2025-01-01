import React, { useState } from 'react';
import { Popover, Button, Box, IconButton, useTheme } from '@mui/material';
import CustomColorPicker from '.';
import * as TablerIcons from '@tabler/icons-react';

const CustomColorPickerDialog = ({ color = "#0d9af2", setColor, readOnly = false }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const ColorIcon = TablerIcons["IconPalette"];
    const theme = useTheme();

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColorChange = (newColor) => {
        setColor(newColor);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'color-picker-popover' : undefined;

    return (
        <div>
            {/* Trigger Block to open the Popover */}
            <Box
                onClick={(e) => {
                    if (!readOnly)
                        handleOpen(e);
                }}
                sx={{
                    width: 30,   // Width of the color block
                    height: 30,  // Height of the color block
                    backgroundColor: color,  // Display current color
                    cursor: 'pointer',
                    borderRadius: 2, // Rounded corners (optional)
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <IconButton size='small'
                    sx={{
                        p: 0
                    }}
                >
                    <ColorIcon color={theme.palette.getContrastText(color)} />
                </IconButton>
            </Box>

            {/* Popover that opens on block click */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box p={2}>
                    {/* Custom Color Picker */}
                    <CustomColorPicker color={color} onChange={handleColorChange} />
                </Box>
            </Popover>
        </div>
    );
};

export default CustomColorPickerDialog;
