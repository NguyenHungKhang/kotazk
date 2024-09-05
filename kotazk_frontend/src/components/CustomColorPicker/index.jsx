import React from 'react';
import { Grid, InputLabel, Input } from '@mui/material';

export default function CustomColorPicker({ color, onColorChange }) {
  return (
    <Grid container alignItems="center" spacing={2} style={{ marginTop: '12px' }}>
      <Grid item xs={4}>
        <InputLabel htmlFor="color">Select Color</InputLabel>
      </Grid>
      <Grid item xs={8}>
        <Input
          id="color"
          name="color"
          type="color"
          size="small"
          margin='dense'
          value={color}
          onChange={onColorChange}
          disableUnderline
          sx={{
            width: 56, // Set width for the color input box
            height: 40, // Set height for the color input box
            padding: 0,
            margin: 0,
            '& input[type="color"]': {
              padding: 0,
              margin: 0,
              width: '100%',
              height: '100%',
              borderRadius: '8px', // Rounded corners
              border: '1px solid #ccc', // Light border
              background: 'none',
              transition: 'border-color 0.3s ease', // Smooth transition for hover effect
              '&:hover': {
                borderColor: '#000', // Darker border color on hover
              },
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
