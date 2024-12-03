import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Stack, IconButton, Checkbox, Divider } from '@mui/material';
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react'
import { useSelector } from 'react-redux';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CustomFilterItemDialog = ({ filter, index, setFilterDialogs }) => {
    const [selectedField, setSelectedField] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]); // Added state for selected options
    const project = useSelector((state) => state.project.currentProject);
    const RemoveIcon = TablerIcons["IconX"]

    const fields = [
        { label: 'Status', value: 'status.id' },
        { label: 'Priority', value: 'priority.id' },
        { label: 'Task Type', value: 'taskType.id' },
        { label: 'Assignee', value: 'assignee.id' },
        { label: 'Completion', value: 'isCompleted' },
        { label: 'Start At', value: 'startAt' },
        { label: 'End At', value: 'endAt' }
    ];

    useEffect(() => {
        if (filter) {
            setSelectedField(filter.field);
            let initialOptions = [];
            if (filter.field == "status.id" || filter.field == "taskType.id" || filter.field == "priority.id" || filter.field == "assignee.id")
                initialOptions = filter.options.map(Number);
            else if (filter.field == "isCompleted")
                initialOptions = filter.options.map(Boolean);
            else if (filter.field == "startAt" || filter.field == "endAt")
                initialOptions = filter.options.map(option => dayjs(option));

            setSelectedOptions(initialOptions);
        }
    }, [filter])

    const fetchOptions = async (field) => {
        setLoading(true);
        try {
            let response;
            switch (field) {
                case 'status.id':
                    response = await fetchStatusOptions();
                    break;
                case 'priority.id':
                    response = await fetchPriorityOptions();
                    break;
                case 'taskType.id':
                    response = await fetchTaskTypeOptions();
                    break;
                case 'assignee.id':
                    response = await fetchMemberOptions();
                    break;
                case 'isCompleted':
                    response = await fetchIsCompletedOptions();
                    break;
                default:
                    response = [];
            }
            setOptions(response);
        } catch (error) {
            console.error('Error fetching options:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusOptions = async () => {
        const data = {
            "filters": []
        }

        const response = await apiService.statusAPI.getPageByProject(project?.id, data);
        if (response?.data) {
            return response?.data?.content.map(i => ({
                "label": i.name,
                "value": i.id
            }))
        } else return [];
    };

    const fetchPriorityOptions = async () => {
        const data = {
            "filters": []
        }

        const response = await apiService.priorityAPI.getPageByProject(project?.id, data);
        if (response?.data) {
            return [{ "label": "No priority*", "value": 0 }, ...response.data.content.map(i => ({
                "label": i.name,
                "value": i.id
            }))]
        } else return [];
    };

    const fetchTaskTypeOptions = async () => {
        const data = {
            "filters": []
        }

        const response = await apiService.taskTypeAPI.getPageByProject(project?.id, data);
        if (response?.data) {
            return response?.data?.content.map(i => ({
                "label": i.name,
                "value": i.id
            }))
        } else return [];
    };

    const fetchMemberOptions = async () => {
        const data = {
            "filters": []
        }

        const response = await apiService.memberAPI.getPageByProject(project?.id, data);
        if (response?.data) {
            return [{ "label": "No assignee", "value": 0 }, ...response.data.content.map(i => ({
                "label": i.user.firstName + ' ' + i.user.lastName,
                "value": i.id
            }))]
        } else return [];
    };

    const fetchIsCompletedOptions = async () => {
        return [
            {
                "label": "Completed",
                "value": true
            },
            {
                "label": "Uncompleted",
                "value": false
            }
        ]
    };


    useEffect(() => {
        if (selectedField) {
            fetchOptions(selectedField);
        } else {
            setOptions([]);
        }
    }, [selectedField]);

    const onSaveToFilterList = (newValue) => {
        const newOptions = newValue.map(option => option.value)
        setSelectedOptions(newOptions);
        const newFilter = {
            "field": selectedField,
            "options": newOptions
        }
        setFilterDialogs(prev => prev.map((item, i) =>
            i === index ? newFilter : item
        ));
    }

    const onSaveTimeFieldToFilterList = (newValue) => {
        setSelectedOptions([newValue]);
        const newFilter = {
            "field": selectedField,
            "options": [newValue]
        }
        setFilterDialogs(prev => prev.map((item, i) =>
            i === index ? newFilter : item
        ));
    }

    const handleRemove = () => {
        setFilterDialogs(prev => prev.filter((item, i) => i != index));

    }

    return (
        <Stack direction='row' spacing={2} alignItems={'center'}>
            {/* First Autocomplete for selecting the field */}
            <Box width={150}>
                <Autocomplete
                    options={fields}
                    value={fields.find(field => field.value === selectedField) || null}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => setSelectedField(newValue ? newValue.value : null)}
                    renderInput={(params) => (
                        <TextField {...params} size='small' variant="outlined" placeholder='Field' />
                    )}
                />
            </Box>

            <Box flexGrow={1}>
                {selectedField != null ? (
                    <>
                        {selectedField == "startAt" || selectedField == "endAt" ?
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    sx={{
                                        width: '100%'
                                    }}
                                    value={selectedOptions?.[0]}
                                    onChange={onSaveTimeFieldToFilterList}
                                    renderInput={(params) => <TextField {...params} />}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </LocalizationProvider>
                            :
                            <Autocomplete
                                multiple
                                options={options}
                                getOptionLabel={(option) => option.label}
                                disableCloseOnSelect
                                value={options.filter(option => selectedOptions.includes(option.value))} // Match options with selected ids
                                onChange={(event, newValue) => { onSaveToFilterList(newValue); }} // Save only ids
                                loading={loading}
                                limitTags={1}
                                ChipProps={{
                                    sx: {
                                        my: "0 !important"
                                    }
                                }}
                                size='small'
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small'
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.label}
                                        </li>
                                    );
                                }}
                            />
                        }

                    </>
                ) :
                    <Divider />
                }
            </Box>
            <Box>
                <IconButton
                    onClick={() => handleRemove()}
                    color='error' size='small'>
                    <RemoveIcon size={16} />
                </IconButton>
            </Box>
        </Stack>
    );
};

export default CustomFilterItemDialog;
