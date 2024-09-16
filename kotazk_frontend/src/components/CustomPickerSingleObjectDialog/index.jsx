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

// Sample object data
const dummyData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Bill Gates', email: 'billg@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Elon Musk', email: 'elonm@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
    // Add more objects if needed
];

const CustomPickerSingleObjectDialog = ({ object, setObject, objectsData, OpenComponent }) => {
    const theme = useTheme();
    const [selectedObject, setSelectedObject] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [objects, setObjects] = useState(dummyData);

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    const handleSelectObject = (object) => {
        if (selectedObject != null && object.id == selectedObject?.id)
            setSelectedObject(null);
        else
            setSelectedObject(object);
        handleClosePopover();
    };

    const filteredObjects = objects.filter((object) =>
        object.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        object.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <OpenComponent action={handleOpenPopover} />
            {/* <Stack flexWrap="wrap" gap={0.5} direction="row" spacing={0.5} alignItems="center" onClick={handleOpenPopover} sx={{cursor: 'pointer'}}>
                {selectedObject ? (
                    <Box
                        key={selectedObject.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                            px: 2,
                            py: 1
                        }}
                    >
                        <Avatar alt={selectedObject.name} src={selectedObject.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
                        <Typography variant='body1'>{selectedObject.name}</Typography>
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
            </Stack> */}

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
                    <TextField
                        placeholder="Search Objects"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
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
                            {filteredObjects.map((object) => (
                                <ListItem
                                    key={object.id}
                                    sx={{
                                        py: 0,
                                        px: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        }
                                    }}
                                    onClick={() => handleSelectObject(object)}
                                    dense
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar alt={object.name} src={object.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
                                                <Box>
                                                    <Typography variant="body2">{object.name}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{object.email}</Typography>
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

export default CustomPickerSingleObjectDialog;
