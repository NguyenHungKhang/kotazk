// DarkModeSwitch.js
import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

const CustomDarkModeSwitch = ({ darkMode, onDarkModeChange }) => {
  const handleDarkModeChange = () => {
    onDarkModeChange(!darkMode);
  };

  return (
    <FormControlLabel
      control={<Switch checked={darkMode} onChange={handleDarkModeChange} />}
      label="Dark Mode"
    />
  );
};

export default CustomDarkModeSwitch;
