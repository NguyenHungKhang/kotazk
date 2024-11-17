import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Popover, Button, IconButton, useTheme } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomFilterItemDialog from './CustomFilterItemDialog';

const CustomComponent = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterDialogs, setFilterDialogs] = useState([1,1,1,1]);
    const theme = useTheme();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddFilter = () => {
        setFilterDialogs([...filterDialogs, 1]);
    };

    const handleClearAll = () => {
        setFilterDialogs([]);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <div>
            <Button
                sx={{ textTransform: 'none' }}
                color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                size="small"
                startIcon={<FilterListIcon fontSize="small" />}
                onClick={handleClick}
            >
                Filter
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box display="flex" flexDirection="column" gap={2} p={2}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button onClick={handleClearAll} color="secondary" variant="outlined">
                            Clear All
                        </Button>
                    </Box>
                    {filterDialogs.map((index) => (
                        <CustomFilterItemDialog key={index} />
                    ))}
                    <Button onClick={handleAddFilter} color="primary" variant="contained">
                        Add Filter
                    </Button>
                </Box>
            </Popover>
        </div>
    );
};

export default CustomComponent;
