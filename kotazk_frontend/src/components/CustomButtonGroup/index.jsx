import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function CustomButtonGroup() {
  return (
    <ButtonGroup variant="outlined" aria-label="Basic button group">
      <Button>One</Button>
      <Button size='small'><KeyboardArrowDownIcon /></Button>
    </ButtonGroup>
  );
}
