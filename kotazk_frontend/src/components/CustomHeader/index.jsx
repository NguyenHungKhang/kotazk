import { Stack, Typography, Box, Avatar, Button, IconButton, AvatarGroup, TextField, InputAdornment, Divider } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const CustomHeader = () => {
    const theme = useTheme();

    return (
        <Box>
            <Stack direction='row' spacing={3} alignItems="center">
                <Stack flexGrow={1} direction='row' spacing={3} alignItems="center">
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <AccountTreeIcon />
                        <Typography
                            variant="h5"
                            fontWeight={650}
                        >

                            Project name
                        </Typography>
                    </Stack>

                    <AvatarGroup
                        max={5}
                        spacing={6}
                        sx={{
                            '& .MuiAvatar-root': {
                                width: 30,
                                height: 30,
                                fontSize: 12
                            },
                        }}
                    >
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}>
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}>
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}>
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}>
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}>
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}>
                            1
                        </Avatar>
                    </AvatarGroup>
                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: theme.palette.primary.main, // Màu nền ban đầu
                            color: theme.palette.primary.contrastText, // Màu text
                            '&:hover': {
                                bgcolor: theme.palette.primary.light, // Màu khi hover
                            },
                            '&:active': {
                                bgcolor: theme.palette.primary.dark, // Màu khi active
                            },
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">


                    <Box>
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
                                        <SearchIcon />
                                    </InputAdornment>
                                ,
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton size="small">
                                            <MicIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ,
                            }}
                        />
                    </Box>
                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: theme.palette.primary.main, // Màu nền ban đầu
                            color: theme.palette.primary.contrastText, // Màu text
                            '&:hover': {
                                bgcolor: theme.palette.primary.light, // Màu khi hover
                            },
                            '&:active': {
                                bgcolor: theme.palette.primary.dark, // Màu khi active
                            },
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: theme.palette.primary.main, // Màu nền ban đầu
                            color: theme.palette.primary.contrastText, // Màu text
                            '&:hover': {
                                bgcolor: theme.palette.primary.light, // Màu khi hover
                            },
                            '&:active': {
                                bgcolor: theme.palette.primary.dark, // Màu khi active
                            },
                        }}
                    >
                        <ChatIcon />
                    </IconButton>
                    <Avatar
                        sx={{
                            width: 35,
                            height: 35
                        }}
                    >
                        H
                    </Avatar>
                </Stack>
            </Stack>
        </Box>
    );
}

export default CustomHeader;