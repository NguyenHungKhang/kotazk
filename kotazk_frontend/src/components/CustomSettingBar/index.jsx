import { Box, Button, Stack, useTheme, darken, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';

const CustomSettingBar = () => {
    const theme = useTheme();
    return (
        <Stack direction='row' spacing={2}>
            {/* <Box>
                <TextField
                    variant="filled"
                    size="small"
                    hiddenLabel
                    placeholder="Search..."
                    InputProps={{
                        disableUnderline: true,
                        sx: {
                            borderColor: "12px solid black",
                            borderRadius: 50
                        },
                        startAdornment:
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ,
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton size="small">
                                    <MicIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ,
                    }}
                />
            </Box> */}
            <Box>
                <Button
                    size='small'
                    sx={{
                        textTransform: 'none',
                        bgcolor: theme.palette.getContrastText(theme.palette.background.default),
                        color: theme.palette.background.default,
                        '&:hover': {
                            bgcolor: darken(theme.palette.getContrastText(theme.palette.background.default), 0.2),
                            color: theme.palette.background.default,
                        },
                        '&:active': {
                            bgcolor: theme.palette.getContrastText(theme.palette.background.default),
                            color: theme.palette.background.default,
                        }
                    }}
                >
                    Share
                </Button>
            </Box>
            <Box>
                <Button
                    size='small'
                    sx={{
                        textTransform: 'none',
                        bgcolor: theme.palette.getContrastText(theme.palette.background.default),
                        color: theme.palette.background.default,
                        '&:hover': {
                            bgcolor: darken(theme.palette.getContrastText(theme.palette.background.default), 0.2),
                            color: theme.palette.background.default,
                        },
                        '&:active': {
                            bgcolor: theme.palette.getContrastText(theme.palette.background.default),
                            color: theme.palette.background.default,
                        }
                    }}
                >
                    Setting
                </Button>
            </Box>
        </Stack>
    );
}

export default CustomSettingBar;