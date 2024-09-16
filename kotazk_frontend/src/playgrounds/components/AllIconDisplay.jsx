import React, { useState } from 'react';
import * as allIcons from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { IconButton, Popover, Grid, Button, ClickAwayListener, Divider, Box, alpha } from "@mui/material";

const ColorPicker = ({ color, onChange }) => {
    const handleColorClick = (event) => {
        onChange(event.target.dataset.color);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {['#2D9CDB', '#EB5757', '#27AE60', '#F2C94C', '#9B51E0', '#BDBDBD', '#F7F7F7', '#333333', '#FFFFFF', '#000000'].map((colorCode) => (
                <div
                    key={colorCode}
                    data-color={colorCode}
                    onClick={handleColorClick}
                    style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: colorCode,
                        border: color === colorCode ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                />
            ))}
        </div>
    );
};




const IconPicker = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState("IconList");
    const [selectedColor, setSelectedColor] = useState("#ffffff");
    const [tempIcon, setTempIcon] = useState(selectedIcon);
    const [tempColor, setTempColor] = useState(selectedColor);

    const iconsList = [
        "IconList",
        "IconLayoutKanbanFilled",
        "IconRocket",
        "IconCalendarWeek",
        "IconChartHistogram",
        "IconComet",
        "IconBulbFilled",
        "IconPuzzle",
        "IconAtom",
        "IconPlanet",
        "IconWorld",
        "IconHexagon",
        "IconTriangle",
        "IconTarget",
        "IconKey",
        "IconCloud",
        "IconWind",
        "IconAnchor",
        "IconCompass",
        "IconCode",
        "IconDiamond",
        "IconMap",
        "IconSun",
        "IconHexagons",
        "IconBox",
    ];

    const handleClick = (event) => {
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
                    color: theme.palette.getContrastText(selectedColor),
                    borderRadius: 2,
                    padding: 2,
                    '&:hover': {
                        backgroundColor: alpha(selectedColor, 0.5),
                    },
                }}
            >
                {selectedIcon in allIcons ? React.createElement(allIcons[selectedIcon], { size: 24, stroke: 2 }) : null}
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
                        <ColorPicker color={tempColor} onChange={handleColorChange} />
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
                                                    padding: 2,
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

export default IconPicker;
