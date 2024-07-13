// ColorPicker.js
import React from 'react';
import { Box, Button } from '@mui/material';

const CustomPrimaryColorThemePicker = ({ onColorChange }) => {
  const colors = ['#7F77F1', '#1090E0', '#3DB88B'];

  const handleColorChange = (color) => {
    onColorChange(color);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      {colors.map((color, index) => (
        <Button
          key={index}
          variant="contained"
          style={{ backgroundColor: color, marginRight: '10px' }}
          onClick={() => handleColorChange(color)}
        >
          {color}
        </Button>
      ))}
    </Box>
  );
};

export default CustomPrimaryColorThemePicker;
