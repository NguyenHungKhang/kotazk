import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Stack } from '@mui/material';

const CustomFilterItemDialog = () => {
    const [selectedField, setSelectedField] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]); // Added state for selected options

    const fields = [
        { label: 'Status', value: 'status' },
        { label: 'Priority', value: 'priority' },
        { label: 'Task Type', value: 'taskType' }
    ];

    const fetchOptions = async (field) => {
        setLoading(true);
        try {
            let response;
            switch (field) {
                case 'status':
                    response = await fetchStatusOptions();
                    break;
                case 'priority':
                    response = await fetchPriorityOptions();
                    break;
                case 'taskType':
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
        // Replace with actual API logic
        return [
            { label: 'Open', value: '1' },
            { label: 'Closed', value: '2' },
            { label: 'In Progress', value: '3' }
        ];
    };

    const fetchPriorityOptions = async () => {
        // Replace with actual API logic
        return [
            { label: 'High', value: '1' },
            { label: 'Medium', value: '2' },
            { label: 'Low', value: '3' }
        ];
    };

    const fetchTaskTypeOptions = async () => {
        // Replace with actual API logic
        return [
            { label: 'Bug', value: '1' },
            { label: 'Feature', value: '2' },
            { label: 'Improvement', value: '3' }
        ];
    };

    useEffect(() => {
        if (selectedField) {
            fetchOptions(selectedField);
        } else {
            setOptions([]);
        }
    }, [selectedField]);

    return (
        <Stack direction='row' spacing={2}>
            {/* First Autocomplete for selecting the field */}
            <Autocomplete
                options={fields}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => setSelectedField(newValue ? newValue.value : '')}
                renderInput={(params) => (
                    <TextField {...params} size='small' variant="outlined" label="Select Field" />
                )}
            />

            {/* Second Autocomplete for selecting options based on the chosen field */}
            <Autocomplete
                multiple
                options={options}
                getOptionLabel={(option) => option.label}
                value={selectedOptions} // Bind to state
                onChange={(event, newValue) => setSelectedOptions(newValue)} // Handle change
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size='small'
                        variant="outlined"
                        label="Select Options"
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
            />
        </Stack>
    );
};

export default CustomFilterItemDialog;
