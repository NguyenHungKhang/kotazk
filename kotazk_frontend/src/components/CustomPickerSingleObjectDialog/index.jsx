import {
    Box,
    List,
    Popover,
    Skeleton,
    TextField,
    useTheme
} from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';


const CustomPickerSingleObjectDialog = ({ selectedObject, setSelectedObject, saveMethod, objectsData, OpenComponent, ItemComponent, isNotNull = false }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [objects, setObjects] = useState(objectsData);
    const [target, setTarget] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (objectsData != null)
            setObjects(objectsData);
    }, [objectsData])

    const handleOpenPopover = () => {
        setOpen(true);
    };

    const handleClosePopover = () => {
        setOpen(false);
    };

    const openPopover = Boolean(anchorEl);

    const handleSelectObject = (object) => {
        if (!isNotNull && selectedObject != null && object.id == selectedObject?.id) {
            setSelectedObject(null);
            if (saveMethod != null)
                saveMethod(null);
        }
        else {
            setSelectedObject(object);
            if (saveMethod != null)
                saveMethod(object);
        }

        handleClosePopover();
    };

    const filteredObjects = objects?.filter((object) => {
        if (object?.name != null)
            return object.name.toLowerCase().includes(searchTerm.toLowerCase())
        else
            return objects;
    });

    return (
        <Suspense fallback="Loading...">
            <OpenComponent setTarget={setTarget} onClick={handleOpenPopover} isFocusing={openPopover} />
            <Popover
                open={open}
                anchorEl={target}
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
                            {filteredObjects ?
                                <>
                                    {filteredObjects?.map((object) => (
                                        <ItemComponent key={object.id} object={object} onClick={handleSelectObject} />
                                    ))}
                                </>
                                :
                                <Skeleton variant='rounded' height="100px" width='100%' />
                            }
                        </List>
                    </Box>
                </div>
            </Popover>
        </Suspense>
    );
};

export default CustomPickerSingleObjectDialog;
