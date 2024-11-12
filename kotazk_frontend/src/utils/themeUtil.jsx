import { alpha } from '@mui/material/styles';

export const getSecondBackgroundColor = (theme) =>
    theme.palette.mode === 'light'
        ? alpha("#F3F5F6", 1)
        : alpha("#2D2D2E", 1)


export const getCustomTwoModeColor = (theme, color1, color2) =>
    theme.palette.mode === 'light'
        ? color1
        : color2