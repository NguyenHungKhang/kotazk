import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Stack, IconButton, Checkbox } from '@mui/material';
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react'
import { useSelector } from 'react-redux';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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
        { label: 'Task Type', value: 'taskType.id' }
    ];

    useEffect(() => {
        if (filter) {
            setSelectedField(filter.field);
            let initialOptions = [];
            if (filter.field == "status.id" || filter.field == "taskType.id" || filter.field == "priority.id")
                initialOptions = filter.options.map(Number);

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
            return response?.data?.content.map(i => ({
                "label": i.name,
                "value": i.id
            }))
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

            {/* Second Autocomplete for selecting options based on the chosen field */}
            <Box flexGrow={1}>
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
