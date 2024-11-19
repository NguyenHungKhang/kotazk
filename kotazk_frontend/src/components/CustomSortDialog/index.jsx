import React, { useState } from 'react';
import { Popover, Button, Autocomplete, TextField, Box, useTheme, Stack, Typography } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSelector } from 'react-redux';
import { setCurrentSortEntity } from '../../redux/actions/sort.action';
import { useDispatch } from 'react-redux';
import * as TablerIcons from '@tabler/icons-react'
import { getCustomTwoModeColor } from '../../utils/themeUtil';

const CustomSortDialog = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();

    // Get the current sort entity and direction from the Redux store
    const selectedField = useSelector((state) => state.sort.currentSortEntity);
    const selectedOrder = useSelector((state) => state.sort.currentSortDirection);
    const dispatch = useDispatch();
    const AscIcon = TablerIcons["IconSortAscending"]
    const DesIcon = TablerIcons["IconSortDescending"]

    // Handle popover toggle
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    // Popover open state
    const open = Boolean(anchorEl);

    // Options for autocomplete
    const fieldOptions = [
        { value: "status.position", label: "Status" },
        { value: "priority.position", label: "Priority" },
        { value: "taskType.position", label: "Task Type" },
        { value: "position", label: "Default position" },
    ];

    const orderOptions = [
        { value: "ascending", label: "Ascending" },
        { value: "descending", label: "Descending" },
    ];

    // Handle field change
    const handleFieldChange = (event, newValue) => {
        const newFieldValue = newValue ? newValue.value : '';
        dispatch(setCurrentSortEntity({
            entity: newFieldValue,
            asc: selectedOrder,  // Keep the current order when the field changes
        }));
    };

    // Handle order change
    const handleOrderChange = (event, newValue) => {
        const newOrderValue = newValue ? newValue.value : '';
        dispatch(setCurrentSortEntity({
            entity: selectedField,  // Keep the current field when the order changes
            asc: newOrderValue,
        }));
    };

    return (
        <div>
            {/* Button to open popover */}
            <Button
                sx={{
                    textTransform: 'none',
                }}
                color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                size="small"
                startIcon={<UnfoldMoreIcon fontSize="small" />}
                onClick={handlePopoverOpen}
            >
                <Stack direction='row' spacing={1} alignItems={'center'}>
                    <Box>
                        Sort
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={18}
                        bgcolor={getCustomTwoModeColor(theme, "#000", "#fff")}
                        px={1}
                        borderRadius={1}
                    >
                        <Box mr={1}>
                            {selectedOrder == "ascending" && (
                                <AscIcon size={18} color={getCustomTwoModeColor(theme, "#fff", "#000")} />
                            )}

                            {selectedOrder == "descending" && (
                                <DesIcon size={18} color={getCustomTwoModeColor(theme, "#fff", "#000")} />
                            )}
                        </Box>
                        <Typography variant='body2' color={getCustomTwoModeColor(theme, "#fff", "#000")}>
                            {fieldOptions.find(i => i.value == selectedField)?.label}
                        </Typography>
                    </Box>

                </Stack>

            </Button>

            {/* Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Stack direction={'row'} spacing={2} sx={{ p: 2, width: 500 }}>
                    <Autocomplete
                        value={fieldOptions.find(option => option.value === selectedField) || null}  // Ensure selectedField has a valid value
                        onChange={handleFieldChange}  // Call the handler for field change
                        options={fieldOptions}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} />}
                        fullWidth
                        size="small"
                        isOptionEqualToValue={(option, value) => option.value === value}
                    />
                    <Autocomplete
                        value={orderOptions.find(option => option.value === selectedOrder) || null}  // Ensure selectedOrder has a valid value
                        onChange={handleOrderChange}  // Call the handler for order change
                        options={orderOptions}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} />}
                        size="small"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        isOptionEqualToValue={(option, value) => option.value === value}
                    />
                </Stack>
            </Popover>
        </div>
    );
};

export default CustomSortDialog;
