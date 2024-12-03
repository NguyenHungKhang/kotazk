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
import { useEffect, useState } from "react";
import * as apiService from "../../api/index"
import WorkSpaceMember from "../../pages/WorkSpaceMember";
import CustomDialogForManage from "../CustomDialogForManage";
import { getAvatar } from "../../utils/avatarUtil";

const CustomMainPageHeader = () => {
    const theme = useTheme();
    const AddIcon = allIcons["IconPlus"];
    const ShareIcon = allIcons["IconShare"];
    const SettingIcon = allIcons["IconSettings"];
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [members, setMembers] = useState([]);

    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState("sm");
    const [children, setChildren] = useState(<WorkSpaceMember />);

    return (
        <Box>
            <Stack direction='row' spacing={3} alignItems="center">
                <Box flexGrow={1}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar
                            src="https://i.pinimg.com/474x/55/26/85/5526851366d0b5c204c2b63cf1305578.jpg"
                            sx={{
                                width: 40,
                                height: 40,
                                cursor: 'pointer',
                                transition: 'transform 0.5s',
                                transform: open ? 'rotate(360deg)' : 'none',
                            }}
                        />
                        <Typography variant="h5" sx={{ ml: 2 }}>
                            Kotazk
                        </Typography>
                    </Stack>

                </Box>
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
                        alt={currentUser?.lastName}
                        src={getAvatar(currentUser?.id, currentUser?.avatarUrl)}
                    >
                        H
                    </Avatar>
                </Stack>
            </Stack>
            <CustomDialogForManage open={open} setOpen={setOpen} children={children} customMaxWidth={maxWidth} />
        </Box>
    );
}

export default CustomMainPageHeader;