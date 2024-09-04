import { darken, lighten } from '@mui/material/styles';

export const getSecondBackgroundColor = (theme) => 
    theme.palette.mode === 'light' 
        ? darken(theme.palette.background.default, 0.05) 
        : lighten(theme.palette.background.default, 0.1);