import React, { useState } from 'react';
import * as allIcons from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { IconButton, Popover, Grid, Button, ClickAwayListener, Divider, Box, alpha, Stack, Typography } from "@mui/material";

const enhancedIconColors = [
    "#f53d3d", // Red
    "#f53d9f", // Pink
    "#8a3df5", // Purple
    "#0d9af2", // Blue
    "#47ebcd", // Green
    "#FFDC49", // Yellow
    "#FFA344", // Orange
    "#f5743d", // Brown
    "#979A9B", // Grey
];

// Checkmark SVG
const CheckmarkIcon = ({ fill }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
        <path
            d="M20.293 6.293a1 1 0 00-1.414 0L10 14.586 5.121 9.707a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l9-9a1 1 0 000-1.414z"
            fill={fill}
        />
    </svg>
);

const CustomColorPicker = ({ color, onChange }) => {
    const theme = useTheme();
    const handleColorClick = (event) => {
        onChange(event.target.dataset.color);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {enhancedIconColors.map((colorCode) => (
                <div
                    key={colorCode}
                    data-color={colorCode}
                    onClick={handleColorClick}
                    style={{
                        position: 'relative',
                        width: '24px',
                        height: '24px',
                        backgroundColor: colorCode,
                        border: color === colorCode ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    {color === colorCode && <CheckmarkIcon fill={theme.palette.getContrastText(colorCode)} />}
                </div>
            ))}
        </div>
    );
};

export default CustomColorPicker;