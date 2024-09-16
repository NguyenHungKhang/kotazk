import { Box, Button, ClickAwayListener, Divider, Grid, IconButton, Popover, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as allIcons from "@tabler/icons-react";
import React, { useState } from 'react';
import CustomColorPicker from '../CustomColorPicker';

const CustomColorIconPicker = ({ changeable, icons }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(icons[0]);
    const [selectedColor, setSelectedColor] = useState("#529CCA");
    const [tempIcon, setTempIcon] = useState(selectedIcon);
    const [tempColor, setTempColor] = useState(selectedColor);
    const [iconsList, setIconsList] = useState(icons);

    const handleClick = (event) => {
        if (changeable)
            setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleIconSelect = (iconName) => {
        setTempIcon(iconName);
    };

    const handleColorChange = (color) => {
        setTempColor(color);
    };

    const handleSave = () => {
        setSelectedIcon(tempIcon);
        setSelectedColor(tempColor);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>

            <IconButton
                onClick={handleClick}
                sx={{
                    backgroundColor: selectedColor,
                    borderRadius: 2,
                    p: 1,
                    color: theme.palette.getContrastText(selectedColor),
                    '&:hover': {
                        backgroundColor: alpha(selectedColor, 0.5),
                    },
                }}
            >
                {selectedIcon in allIcons ? React.createElement(allIcons[selectedIcon], { size: 18, stroke: 2 }) : null}
            </IconButton>

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
                PaperProps={{
                    style: {
                        padding: '16px',
                        width: 300,
                    },
                }}
                BackdropProps={{
                    style: {
                        display: 'none',
                    },
                }}
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <Box>
                        <CustomColorPicker color={tempColor} onChange={handleColorChange} />
                        <Divider sx={{ my: 2 }} />
                        <Box
                            sx={{
                                maxHeight: 200,
                                overflowY: 'auto',
                                border: '1px solid',
                                borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[600],
                                borderRadius: 2
                            }}
                        >
                            <Grid container spacing={2} justifyContent="center">
                                {iconsList.map((iconName, index) => {
                                    const IconComponent = allIcons[iconName];
                                    return (
                                        <Grid
                                            item
                                            key={index}
                                            xs={3}
                                            display='flex'
                                            justifyContent='center'
                                            alignItems='center'
                                        >
                                            <IconButton
                                                onClick={() => handleIconSelect(iconName)}
                                                sx={{
                                                    padding: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: tempIcon === iconName ? tempColor : 'transparent',
                                                    transition: 'background-color 0.3s',
                                                    '&:hover': {
                                                        backgroundColor: tempIcon === iconName ? alpha(tempColor, 0.5) : theme.palette.action.hover,
                                                    },
                                                    '&:active': {
                                                        backgroundColor: theme.palette.action.selected,
                                                    },
                                                }}
                                            >
                                                {IconComponent ? <IconComponent size={24} stroke={2} color={tempIcon === iconName ? theme.palette.getContrastText(tempColor) : theme.palette.text.primary} /> : null}
                                            </IconButton>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                        <Button
                            variant="contained"
                            color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                            fullWidth
                            onClick={handleSave}
                            sx={{ marginTop: '16px' }}
                        >
                            Save
                        </Button>
                    </Box>
                </ClickAwayListener>
            </Popover>
        </div>
    );
};

export default CustomColorIconPicker;
