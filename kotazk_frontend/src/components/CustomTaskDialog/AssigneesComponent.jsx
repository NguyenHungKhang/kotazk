import React, { useState } from 'react';
import {
    Stack,
    IconButton,
    Popover,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Sample user data
const usersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Bill Gates', email: 'billg@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Elon Musk', email: 'elonm@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
    // Add more users if needed
];

const AssigneesComponent = () => {
    const theme = useTheme();
    const [selectedUser, setSelectedUser] = useState(null); // For selected assignee
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(usersData); // Store the list of users

    // Open and close popover
    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    // Handle selecting a user (only one)
    const handleSelectUser = (user) => {
        if (selectedUser != null && user.id == selectedUser?.id)
            setSelectedUser(null);
        else
            setSelectedUser(user);
        handleClosePopover(); // Close popover after selecting
    };

    // Filter users based on search term
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Stack displaying the selected user (with avatar and name) */}
            <Stack flexWrap="wrap" gap={0.5} direction="row" spacing={0.5} alignItems="center" onClick={handleOpenPopover} sx={{cursor: 'pointer'}}>
                {/* <IconButton  size="small">
                    <AddIcon fontSize="small" />
                </IconButton> */}
                {selectedUser ? (
                    <Box
                        key={selectedUser.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                            px: 2,
                            py: 1
                        }}
                    >
                        <Avatar alt={selectedUser.name} src={selectedUser.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
                        <Typography variant='body1'>{selectedUser.name}</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                            px: 2,
                            py: 1
                        }}
                    >
                        <Avatar alt={"Unassigned"}
                            sx={{
                                width: 24,
                                height: 24,
                                marginRight: 1,
                                border: "2px dotted",
                                borderColor: theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400],
                            }}

                        />
                        <Typography variant='body1'>Unassigned</Typography>
                    </Box>
                )}
            </Stack>

            {/* Popover with search bar and user list */}
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
                <div style={{ padding: '8px', width: '300px' }}>
                    {/* Search bar */}
                    <TextField
                        placeholder="Search Users"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* List of users without checkboxes */}
                    <Box
                        sx={{
                            p: 1,
                            maxHeight: 300,
                            overflowY: 'auto',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[600],
                        }}
                    >
                        <List dense>
                            {filteredUsers.map((user) => (
                                <ListItem
                                    key={user.id}
                                    sx={{
                                        py: 0,
                                        px: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        }
                                    }}
                                    onClick={() => handleSelectUser(user)} // Handle user selection
                                    dense
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar alt={user.name} src={user.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
                                                <Box>
                                                    <Typography variant="body2">{user.name}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </div>
            </Popover>
        </div>
    );
};

export default AssigneesComponent;
