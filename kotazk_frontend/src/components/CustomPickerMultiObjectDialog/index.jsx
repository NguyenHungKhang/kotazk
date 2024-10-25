import {
    Box,
    List,
    Popover,
    TextField,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';


const CustomPickerMultiObjectDialog = ({ selectedObjects, setSelectedObjects, saveMethod, objectsData, OpenComponent, ItemComponent, isNotNull = false }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [objects, setObjects] = useState(objectsData);

    const handleOpenPopover = (event) => {
        console.log('AnchorEl:', event.currentTarget);
        if (!anchorEl) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);

    const handleSelectObject = (object, event) => {
        event.stopPropagation();
        let objectList;
        if (selectedObjects.includes(object) || selectedObjects.find(selectedObject => selectedObject.id === object.id)) {
            objectList = selectedObjects.filter((obj) => obj.id !== object.id);
        } else {
            objectList = [...selectedObjects, object];
        }
        setSelectedObjects(objectList)
        saveMethod(objectList);
    };

    const filteredObjects = objects.filter((object) =>
        object.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Box
                onClick={handleOpenPopover}
                isFocusing={openPopover}>
                <OpenComponent />
            </Box>
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
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
                disablePortal
                keepMounted
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
                                <ItemComponent key={object.id} object={object} onClick={handleSelectObject} />
                            ))}
                        </List>
                    </Box>
                </div>
            </Popover>
        </div>
    );
};

export default CustomPickerMultiObjectDialog;
