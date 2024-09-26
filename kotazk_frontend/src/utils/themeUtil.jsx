import { alpha } from '@mui/material/styles';

export const getSecondBackgroundColor = (theme) => 
    theme.palette.mode === 'light' 
        ? alpha("#f5f5fc", 1)
        : alpha("#f5f5fc", 0.07)