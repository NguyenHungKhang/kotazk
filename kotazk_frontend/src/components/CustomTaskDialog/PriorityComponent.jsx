import React, { useState } from 'react';
import {
    Stack,
    Box,
    Typography,
    Popover,
    List,
    ListItem,
    ListItemText,
    TextField,
    Avatar,
    useTheme,
    alpha,
} from '@mui/material';

// Define priorities with their respective colors and icons
const priorities = [
    { id: 1, label: 'Very Low', color: '#529CCA' },
    { id: 2, label: 'Low', color: '#4DAB9A' },
    { id: 3, label: 'Medium', color: '#FFDC49' },
    { id: 4, label: 'High', color: '#FFA344' },
    { id: 5, label: 'Very High', color: '#FF7369' }
];



const PriorityComponent = () => {
    const theme = useTheme();
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Open and close popover
    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    // Handle selecting a priority
    const handleSelectPriority = (priority) => {
        if (selectedPriority != null && priority.id == selectedPriority.id)
            setSelectedPriority(null);
        else
            setSelectedPriority(priority);
        handleClosePopover();
    };

    // Filter priorities based on search term
    const filteredPriorities = priorities.filter((priority) =>
        priority.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Display selected priority */}
            <Stack flexWrap="wrap" gap={0.5} direction="row" spacing={0.5} alignItems="center" onClick={handleOpenPopover} sx={{ cursor: 'pointer' }}>
                {selectedPriority ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: selectedPriority.color,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant='body2' color={theme.palette.getContrastText(selectedPriority.color)}>{selectedPriority.label}</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant='body2' color={theme.palette.text.secondary}>Empty</Typography>
                    </Box>
                )}
            </Stack>

            {/* Popover with search and list of priorities */}
            <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <div style={{ padding: '8px', width: '250px' }}>
                    {/* Search bar */}
                    <TextField
                        placeholder="Search Priority"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* List of priorities */}
                    <List dense>
                        {filteredPriorities.map((priority) => (
                            <ListItem
                                key={priority.id}
                                sx={{
                                    my: 0.5,
                                    py: 0.5,
                                    px: 1,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    backgroundColor: priority.color,
                                    '&:hover': {
                                        backgroundColor: alpha(priority.color, 0.8),
                                    }
                                }}
                                onClick={() => handleSelectPriority(priority)} // Handle priority selection
                            >
                                <ListItemText primary={
                                    <Typography variant='body2' textAlign='center' color={theme.palette.getContrastText(priority.color)}>
                                        {priority.label}
                                    </Typography>

                                } />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Popover>
        </div>
    );
};

export default PriorityComponent;
