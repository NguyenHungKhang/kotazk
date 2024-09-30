import React, { useState } from 'react';
import { Popover, Button, Box } from '@mui/material';
import CustomColorPicker from '.';

const CustomColorPickerDialog = ({ color = "#0d9af2", setColor }) => {
    const [anchorEl, setAnchorEl] = useState(null); // For anchoring the Popover

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget); // Set the block as the anchor for the Popover
    };

    const handleClose = () => {
        setAnchorEl(null); // Close the Popover by removing the anchor
    };

    const handleColorChange = (newColor) => {
        setColor(newColor); // Update the state with the new selected color
    };

    const open = Boolean(anchorEl); // Determines if the Popover is open
    const id = open ? 'color-picker-popover' : undefined;

    return (
        <div>
            {/* Trigger Block to open the Popover */}
            <Box
                onClick={handleOpen}
                sx={{
                    width: 30,   // Width of the color block
                    height: 30,  // Height of the color block
                    backgroundColor: color,  // Display current color
                    cursor: 'pointer',
                    borderRadius: 2, // Rounded corners (optional)
                    border: '1px solid #ccc',  // Border to make it stand out
                }}
            />

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

                    {/* Save Button */}
                    <Button onClick={handleClose} color="primary">
                        Save
                    </Button>
                </Box>
            </Popover>
        </div>
    );
};

export default CustomColorPickerDialog;
