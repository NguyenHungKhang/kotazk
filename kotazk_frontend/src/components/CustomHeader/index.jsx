import { Stack, Typography, Box, Avatar, Button, IconButton, AvatarGroup, TextField, InputAdornment, Divider, Badge, darken } from "@mui/material";
import * as allIcons from "@tabler/icons-react"
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CustomDarkModeSwitch from "../CustomDarkModeSwitch";
import CustomColorIconPicker from "../CustomProjectColorIconPicker";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CustomHeader = () => {
    const theme = useTheme();
    const AddIcon = allIcons["IconPlus"];
    const ShareIcon = allIcons["IconShare"];
    const SettingIcon = allIcons["IconSettings"];
    const project = useSelector((state) => state.project.currentProject);
    return (
        <Box>
            <Stack direction='row' spacing={3} alignItems="center">
                <Stack flexGrow={1} direction='row' spacing={3} alignItems="center">
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <CustomColorIconPicker />
                        <Typography
                            variant="h5"
                            fontWeight={650}
                        >

                            {project ? project.name : "Project name"}
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

                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                            }}
                            alt="Test avatar"
                            src="https://letstryai.com/wp-content/uploads/2023/11/stable-diffusion-avatar-prompt-example-1.jpg"
                        />

                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn86DMGD6PaQio8nhzWKwq4UGv_iLQOwTMSA&s"
                        >
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO4IPjULjl8ufw3oKgUTW3io9sUUNz1uZ9MQ&s"
                        >
                            1
                        </Avatar>
                        <Avatar sx={{
                            width: 30,
                            height: 30,
                        }}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRCsVvBWpqMB7xG-St5geqC7R_E3io4ksuQ&s"
                        >
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
                    <Button
                        sx={{
                            textTransform: 'none',
                            borderRadius: 5
                        }}
                        variant="contained"
                        size="small"
                        startIcon={
                            <AddIcon size={16} />
                        }
                    >
                        Add member
                    </Button>
                </Stack>
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
                            variant="outlined"
                            color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                            startIcon={<ShareIcon size={16} />}
                            sx={{
                                textTransform: 'none'
                            }}
                        >
                            Share
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            component={Link}
                            to={`/project/${project?.id}/setting`}
                            size='small'
                            variant='contained'
                            color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                            startIcon={<SettingIcon size={16} />}
                            sx={{
                                textTransform: 'none'
                            }}
                        >
                            Setting
                        </Button>
                    </Box>
                </Stack>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Stack direction="row" spacing={2} alignItems="center">
                    <CustomDarkModeSwitch />
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
                        <NotificationsIcon fontSize="small" />
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
                        <ChatIcon fontSize="small" />
                    </IconButton>
                    <Avatar
                        sx={{
                            width: 30,
                            height: 30
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