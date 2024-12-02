import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CustomButtonGroup = () => {
  return (
    <ButtonGroup size='small' variant="contained" aria-label="Basic button group">
      <Button size='small' sx={{ textTransform: 'none' }}>Create task</Button>
      <Button size='small'><KeyboardArrowDownIcon /></Button>
    </ButtonGroup>
  );
}

export default CustomButtonGroup;
