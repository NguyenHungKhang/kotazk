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
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFilterList } from '../../redux/actions/filter.action';

const CustomFilterDialog = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterRows, setFilterRows] = useState([{ key: '', operation: '', value: '', active: false }]);

    const statuses = useSelector((state) => state.status.currentStatusList);
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const members = useSelector((state) => state.member.currentMemberList);

    // Mapping keys to labels for UI display
    const keyLabelMap = {
        'status.id': 'Status',
        'priority.id': 'Priority',
        'assignee.id': 'Assignee',
    };

    // Operators for the filter
    const operations = ['EQUAL', 'NOT EQUALS'];

    // Get value options dynamically based on selected key
    const getValueOptions = (key) => {
        switch (key) {
            case 'status.id':
                return statuses.map(status => ({ label: status.name, value: status.id }));
            case 'priority.id':
                return priorities.map(priority => ({ label: priority.name, value: priority.id }));
            case 'assignee.id':
                return members.map(member => ({ label: member.name, value: member.id }));
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

        // Filter rows to dispatch only the active ones with full values
        const validRows = updatedRows.filter(row =>
            row.active && row.key && row.operation && row.value
        );

        // Dispatch only the filtered valid rows
        dispatch(setCurrentFilterList(validRows));
    };

    // Handle toggle active state for each row
    const toggleActive = (index) => {
        const updatedRows = filterRows.map((row, i) =>
            i === index ? { ...row, active: !row.active } : row
        );
        setFilterRows(updatedRows);
    };

    // Add a new row
    const addFilterRow = () => {
        setFilterRows([...filterRows, { key: '', operation: '', value: '', active: false }]);
    };

    // Delete a row
    const deleteFilterRow = (index) => {
        setFilterRows(filterRows.filter((_, i) => i !== index));
    };

    // Select All
    const selectAll = () => {
        const updatedRows = filterRows.map(row => ({
            ...row,
            active: true, // Set all rows to active
        }));
        setFilterRows(updatedRows);
    };

    // Deselect All
    const deselectAll = () => {
        const updatedRows = filterRows.map(row => ({
            ...row,
            active: false, // Set all rows to inactive
        }));
        setFilterRows(updatedRows);
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
                PaperProps={{ style: { maxHeight: 700, width: 700, overflow: 'auto' } }} // Enable scroll for popover
            >
                <Box padding={2}>
                    {/* Select All and Deselect All Buttons */}
                    <Stack direction="row" justifyContent="space-between" marginBottom={2}>
                        <Button variant="contained" onClick={selectAll}>
                            Select All
                        </Button>
                        <Button variant="outlined" onClick={deselectAll}>
                            Deselect All
                        </Button>
                    </Stack>

                    {filterRows.map((row, index) => (
                        <Box display="flex" alignItems="center" key={index} marginBottom={2}>
                            {/* Checkbox for Activating Row */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size='small'
                                        checked={row.active}
                                        onChange={() => toggleActive(index)}
                                    />
                                }
                                label="Active"
                            />

                            {/* Key Select */}
                            <FormControl size='small' fullWidth margin="normal" sx={{ mr: 1 }}>
                                <InputLabel>Key</InputLabel>
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

                            {/* Operator Select */}
                            <FormControl size='small' fullWidth margin="normal" sx={{ mr: 1 }}>
                                <InputLabel>Operator</InputLabel>
                                <Select
                                    size='small'
                                    value={row.operation}
                                    onChange={(e) => handleFilterChange(index, 'operation', e.target.value)}
                                    disabled={!row.key} // Disable until key is selected
                                >
                                    {operations.map((operation, i) => (
                                        <MenuItem key={i} value={operation}>
                                            {operation}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Value Select */}
                            <FormControl size='small' fullWidth margin="normal">
                                <InputLabel>Value</InputLabel>
                                <Select
                                    size='small'
                                    value={row.value}
                                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                    disabled={!row.key} // Disable until key is selected
                                >
                                    {getValueOptions(row.key).map((option, i) => (
                                        <MenuItem key={i} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Delete Button */}
                            <IconButton onClick={() => deleteFilterRow(index)} sx={{ ml: 1 }}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}

                    {/* Add Row Button */}
                    <Button
                        variant="outlined"
                        onClick={addFilterRow}
                        startIcon={<AddIcon />}
                        fullWidth
                    >
                        Add Filter
                    </Button>
                </Box>
            </Popover>
        </div>
    );
};

export default CustomFilterDialog;
