import React, { useEffect, useState } from 'react';
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
    TextField,
    Grid2,
    Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentFilterList } from '../../redux/actions/filter.action';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import * as apiService from '../../api/index'

const keys = [
    {
        "field": "status",
        "type": "system",
        "mapKey": "status.id",
        "label": "Status"
    },
    {
        "field": "priority",
        "type": "system",
        "mapKey": "priority.id",
        "label": "Priority"
    },
    {
        "field": "taskType",
        "type": "system",
        "mapKey": "taskType.id",
        "label": "Task Type"
    },
]

const CustomFilterDialog = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterRows, setFilterRows] = useState([]);
    const project = useSelector((state) => state.project.currentProject)

    const CancleIcon = TablerIcons["IconX"];

    const statuses = useSelector((state) => state.status.currentStatusList);
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const projectMembers = useSelector((state) => state.member.currentProjectMemberList);

    const keyLabelMap = {
        'status.id': 'Status',
        'priority.id': 'Priority',
        'assignee.id': 'Assignee',
    };

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const handleUpdateChange = (updateRow) => {
        let rowExists = false;
        const updatedRows = filterRows.map((row, i) => {
            if (row.key === updateRow.key) {
                rowExists = true;
                return { ...row, value: updateRow.value };
            }
            return row;
        });
        if (!rowExists) {
            updatedRows.push(updateRow);
        }
        setFilterRows(updatedRows);
        const validRows = updatedRows.filter(row =>
            row.key && row.operation && row.value.length > 0
        );
        dispatch(setCurrentFilterList(validRows));
    };

    const handleFilterChange = (index, field, value) => {
        const updatedRows = filterRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setFilterRows(updatedRows);

        const validRows = updatedRows.filter(row =>
            row.key && row.operation && row.value.length > 0
        );
        dispatch(setCurrentFilterList(validRows));
    };

    const addFilterRow = () => {
        setFilterRows([...filterRows, { key: '', operation: 'IN', value: [] }]);
    };
    const deleteFilterRow = (index) => {
        const updatedRows = filterRows.filter((_, i) => i !== index);
        setFilterRows(updatedRows);

        const validRows = updatedRows.filter(row =>
            row.key && row.operation && row.value
        );
        dispatch(setCurrentFilterList(validRows));
    };

    const clearAll = () => {
        setFilterRows([]);
        dispatch(setCurrentFilterList([]));
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
                slotProps={{
                    paper: {
                        sx: { maxHeight: 700, width: 500, overflow: 'auto', bgcolor: `${theme.palette.background.default} !important`, }
                    }
                }}
            >
                <Box padding={4}>
                    {/* Clear All Button */}
                    <Stack direction="row" alignItems='center'>
                        <Box flexGrow={1}>
                            <Typography variant='body1'>
                                Filter
                            </Typography>
                        </Box>
                        <Button variant="text" size='small' color='error' onClick={clearAll}>
                            Clear
                        </Button>
                    </Stack>
                    <Box>
                        {filterRows.map((row, index) => (
                            <Stack direction={'row'} alignItems="center" key={index} spacing={1}>
                                {/* Key Select */}
                                <Grid2 container spacing={2} alignItems={'center'} width={'100%'}>
                                    <Grid2 size={4}>
                                        <TextField
                                            select
                                            size='small'
                                            autoFocus
                                            slotProps={{
                                                select: {
                                                    value: row.key,
                                                    onChange: (e) => {
                                                        handleFilterChange(index, 'key', e.target.value)
                                                    }
                                                }
                                            }}
                                            sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 }, }}
                                            fullWidth
                                        >
                                            {Object.keys(keyLabelMap).map((key, i) => (
                                                <MenuItem key={i} value={key}>
                                                    {keyLabelMap[key]}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </Grid2>
                                    <Grid2 size={8}>
                                        <Autocomplete
                                            size='small'
                                            multiple
                                            options={getValueOptions(row.key)}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(e, newValue) => {
                                                console.log(newValue);
                                                handleFilterChange(index, 'value', newValue.map(v => v.value));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size='small'
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid2>
                                </Grid2>

                                <Box>
                                    <IconButton size='small' onClick={() => deleteFilterRow(index)} sx={{ ml: 1 }}>
                                        <CancleIcon size={16} />
                                    </IconButton>
                                </Box>
                            </Stack>
                        ))}
                    </Box>
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


// const FilterRow = ({ currentKeys, projectId, handleUpdateChange }) => {
//     const [key, setKey] = useState(null);
//     const [keys, setKeys] = useState([]);
//     const [options, setOptions] = useState([]);
//     const [values, setValues] = useState(null);

//     useEffect(() => {
//         setKeys(currentKeys);
//     }, [currentKeys])

//     useEffect(() => {
//         if (key != null)
//             fetchOptions();
//     }, [key])

//     const fetchOptions = async () => {
//         const data = {
//             'sortBy': 'position',
//             'sortDirectionAsc': true,
//             'filters': []
//         }

//         let optionsResponse = [];
//         if (key.field == "status")
//             optionsResponse = await apiService.statusAPI.getPageByProject(projectId, data)
//         else if (key.field == "taskType")
//             optionsResponse = await apiService.taskTypeAPI.getPageByProject(projectId, data)
//         else if (key.field == "priority")
//             optionsResponse = await apiService.priorityAPI.getPageByProject(projectId, data)

//         if (optionsResponse?.data) {
//             setOptions(optionsResponse?.data?.content)
//             setValues([]);
//         }
//     }

//     const handleSelectKey = (selectedKey) => {
//         setKey(selectedKey);
//     }

//     const handleSaveValue = (newValues) => {
//         setValues(newValues);
//         if (key != null && newValues?.length > 0) {
//             let row = {
//                 'key': key?.mapKey,
//                 'operation': 'IN',
//                 'value': newValues.map(nv => nv.id)
//             }
//             handleUpdateChange(row);
//         }
//     }


//     return (
//         <>
//             <TextField
//                 select
//                 size='small'
//                 autoFocus
//                 slotProps={{
//                     select: {
//                         value: key,
//                         onChange: (e) => handleSelectKey(e.target.value)
//                     }
//                 }}
//                 sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 }, }}
//                 fullWidth
//             >
//                 {keys?.map((k, i) => (
//                     <MenuItem key={i} value={k}>
//                         {k.label}
//                     </MenuItem>
//                 ))}
//             </TextField>
//             <Autocomplete
//                 size='small'
//                 value={values}
//                 multiple
//                 options={options}
//                 getOptionLabel={(option) => option.name}
//                 onChange={(e, newValue) => {
//                     handleSaveValue(newValue);
//                 }}
//                 renderInput={(params) => (
//                     <TextField
//                         {...params}
//                         size='small'
//                         variant="outlined"
//                         sx={{
//                             "& .MuiInputBase-input": {
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis"
//                             }
//                         }}
//                     />
//                 )}
//             />
//         </>
//     );
// }

export default CustomFilterDialog;
