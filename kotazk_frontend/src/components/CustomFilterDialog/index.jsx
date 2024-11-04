import React, { useState } from 'react';
import {
    Button,
    Popover,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Box,
    Stack,
    Typography,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFilterList } from '../../redux/actions/filter.action';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';

const CustomFilterDialog = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterRows, setFilterRows] = useState([{ key: '', operation: "IN", value: [] }]);

    const CancleIcon = TablerIcons["IconX"];

    const statuses = useSelector((state) => state.status.currentStatusList);
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const projectMembers = useSelector((state) => state.member.currentProjectMemberList);

    // Mapping keys to labels for UI display
    const keyLabelMap = {
        'status.id': 'Status',
        'priority.id': 'Priority',
        'assignee.id': 'Assignee',
    };

    // Get value options dynamically based on selected key
    const getValueOptions = (key) => {
        switch (key) {
            case 'status.id':
                return statuses.map(status => ({ label: status.name, value: status.id }));
            case 'priority.id':
                return priorities.map(priority => ({ label: priority.name, value: priority.id }));
            case 'assignee.id':
                return projectMembers.map(member => ({ label: member.user.lastName, value: member.id }));
            default:
                return [];
        }
    };

    // Open the popover
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the popover
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // Handle changes for key, operation, and value select inputs
    const handleFilterChange = (index, field, value) => {
        const updatedRows = filterRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setFilterRows(updatedRows);
        console.log(updatedRows);
        const validRows = updatedRows.filter(row =>
            row.key && row.operation && row.value.length > 0
        );
        dispatch(setCurrentFilterList(validRows));
    };

    // Add a new row
    const addFilterRow = () => {
        setFilterRows([...filterRows, { key: '', operation: 'IN', value: [] }]);
    };

    // Delete a row and dispatch
    const deleteFilterRow = (index) => {
        const updatedRows = filterRows.filter((_, i) => i !== index);
        setFilterRows(updatedRows);

        // Dispatch updated rows after deletion
        const validRows = updatedRows.filter(row =>
            row.key && row.operation && row.value
        );
        dispatch(setCurrentFilterList(validRows));
    };

    // Clear all rows and dispatch an empty list
    const clearAll = () => {
        setFilterRows([{ key: '', operation: '', value: '' }]); // Keep one empty row
        dispatch(setCurrentFilterList([])); // Dispatch empty filter list
    };

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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                slotProps={{ paper:{
                    sx: { maxHeight: 700, width: 500, overflow: 'auto',   bgcolor: `${theme.palette.background.default} !important`, }
                } }} // Enable scroll for popover
            >
                <Box padding={4}>
                    {/* Clear All Button */}
                    <Stack direction="row" alignItems='center'>
                        <Box flexGrow={1}>
                            <Typography variant='h6'>
                                Filter
                            </Typography>
                        </Box>
                        <Button variant="text" size='small' color='error' onClick={clearAll}>
                            Clear
                        </Button>
                    </Stack>
                    <Box bgcolor={getSecondBackgroundColor(theme)}
                        borderRadius={2}
                    >
                        {filterRows.map((row, index) => (
                            <Stack direction={'row'} alignItems="center" key={index}>
                                {/* Key Select */}
                                <FormControl size='small' fullWidth margin="normal" sx={{ mr: 1 }}>
                                    <Select
                                        size='small'
                                        value={row.key}
                                        onChange={(e) => handleFilterChange(index, 'key', e.target.value)}
                                    >
                                        {Object.keys(keyLabelMap).map((key, i) => (
                                            <MenuItem key={i} value={key}>
                                                {keyLabelMap[key]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Value Select */}
                                <FormControl size='small' fullWidth margin="normal">
                                    <Select
                                        size='small'
                                        value={row.value}
                                        multiple
                                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                        disabled={!row.key}
                                        renderValue={(selected) => (
                                            selected.map((value) => (
                                                <Chip size='small' key={value} label={getValueOptions(row.key).find(v => value == v.value).label} sx={{mr: 1}} />
                                            ))
                                        )}
                                    >
                                        {getValueOptions(row.key).map((option, i) => (
                                            <MenuItem key={i} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Delete Button */}
                                <Box>
                                    <IconButton size='small' onClick={() => deleteFilterRow(index)} sx={{ ml: 1 }}>
                                        <CancleIcon size={16} />
                                    </IconButton>
                                </Box>
                            </Stack>
                        ))}
                    </Box>
                    {/* Add Row Button */}
                    <Button
                        variant="text"
                        size='small'
                        color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                        onClick={addFilterRow}
                        startIcon={<AddIcon />}
                    >
                        Add Filter
                    </Button>
                </Box>
            </Popover>
        </div>
    );
};

export default CustomFilterDialog;
