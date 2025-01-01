import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

const CustomTextFieldWithValidation = ({
    id,
    name,
    label,
    value,
    onChange,
    maxLength,
    required = false,
    multiline = false,
    rows = 1,
    errorHelperText = 'This field is required.',
    regexErrorText = 'Invalid input format.',
    validationRegex = null,
    defaultHelperText = '',
    setFormError = () => {},
    ...props
}) => {
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState(defaultHelperText);

    const handleValidation = (newValue) => {
        // Check if the field is required but empty
        if (required && !newValue.trim()) {
            setError(true);
            setFormError(true);
            setHelperText(errorHelperText);
        }
        // Check if the input matches the provided regex
        else if (validationRegex && !validationRegex.test(newValue)) {
            setError(true);
            setFormError(true);
            setHelperText(regexErrorText);
        } else {
            setError(false);
            setFormError(false);
            setHelperText(defaultHelperText);
        }
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        onChange(event); // Pass the change event back to the parent
        handleValidation(newValue);
    };

    const currentLength = value ? value.length : 0;

    return (
        <Box>
            <TextField
                id={id}
                name={name}
                label={label}
                value={value}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline={multiline}
                rows={multiline ? rows : 1}
                error={error} // Set the error state based on validation
                helperText={helperText} // Show error helper text if error is true
                required={required}
                inputProps={{ maxLength }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Typography
                                variant="caption"
                                color={error ? 'error' : 'text.secondary'}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                {currentLength} / {maxLength}
                            </Typography>
                        </InputAdornment>
                    ),
                }}
                {...props}
            />
        </Box>
    );
};

export default CustomTextFieldWithValidation;
