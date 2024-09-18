import React from 'react';
import { TextField, styled } from '@mui/material';

const CustomBasicTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius, // Use theme's border radius
    '& fieldset': {
      border: 'none', // Remove the outline
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover, // Background on hover from theme
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.action.selected, // Background on focus from theme
    },
  },
}));

export default CustomBasicTextField;
