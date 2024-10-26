import { alpha } from '@mui/material/styles';

export const getSecondBackgroundColor = (theme) => 
    theme.palette.mode === 'light' 
        ? alpha("#F6F5F2", 1)
        : alpha("#2D2D2E", 1)