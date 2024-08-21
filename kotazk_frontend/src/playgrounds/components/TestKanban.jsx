import { Stack, Typography, Box, Avatar, Button, IconButton, AvatarGroup, TextField, InputAdornment, Divider } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from "@mui/material";
import TestBreadcrumb from "./TestBreadcrumbs";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { BorderBottom } from "@mui/icons-material";
import TestGroupButtonMenu from "./TestGroupButtonMenu";
import TestDND from './TestDND';
import TestTab from "./TestTab";
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';



const TestKanban = () => {
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
                        sx={{
                            bgcolor: "#E8E8E8",
                            '&:hover': {
                                bgcolor: theme.palette.grey[400],
                            },
                            '&:active': {
                                bgcolor: theme.palette.grey[500],
                            },
                            height: 30,
                            width: 30
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
                                        <IconButton>
                                            <MicIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ,
                            }}
                        />
                    </Box>
                    <IconButton
                        sx={{
                            bgcolor: "#E8E8E8",
                            '&:hover': {
                                bgcolor: theme.palette.grey[400],
                            },
                            '&:active': {
                                bgcolor: theme.palette.grey[500],
                            },
                            borderRadius: 3,
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    <IconButton
                        sx={{
                            bgcolor: "#E8E8E8",
                            '&:hover': {
                                bgcolor: theme.palette.grey[400],
                            },
                            '&:active': {
                                bgcolor: theme.palette.grey[500],
                            },
                            borderRadius: 3,
                        }}
                    >
                        <ChatIcon />
                    </IconButton>
                    <Avatar>
                        H
                    </Avatar>
                </Stack>
            </Stack>
            <Box
                mt={2}
                sx={{
                    pl: 9,
                    position: 'relative', // Để pseudo-element có thể được định vị tương đối
                    // overflow: 'hidden', // Để đảm bảo pseudo-element không tràn ra ngoài Box
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -12, // Điều chỉnh vị trí của đường cong
                        left: 10,
                        width: 18,
                        height: 28, // Chiều cao của đường cong
                        background: 'transparent', // Màu sắc của đường cong
                        // Tạo đường cong hình elip
                        border: "2px solid grey",
                        borderBottomLeftRadius: 12,
                        borderTop: "none",
                        // borderBottom: "none",
                        borderRight: "none"
                    },
                }}
            >
                <TestBreadcrumb />
            </Box>
            <Stack
                direction='row'
                mt={4}
                mb={2}
                spacing={2}
            >
                <Box flexGrow={1}>
                    <TestGroupButtonMenu />
                </Box>
                <Button
                    sx={{
                        textTransform: 'none',
                    }}
                    size="small"
                    variant="text"
                    startIcon={<SettingsIcon />}
                >
                    Option
                </Button>
            </Stack>
            <Divider />
            <Stack
                direction='row'
                my={2}
                spacing={2}
            >
                <Box flexGrow={1}>
                    <Button
                        variant='contained'
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{
                            textTransform: 'none'
                        }}
                    >
                        Add task
                    </Button>
                </Box>

                <Button
                    size="small"
                    startIcon={<FilterListIcon />}
                    sx={{
                        textTransform: 'none'
                    }}
                >
                    Filter
                </Button>
                <Button
                    size="small"
                    startIcon={<SwapVertIcon />}
                    sx={{
                        textTransform: 'none'
                    }}
                >
                    Sort
                </Button>
                <Button
                    size="small"
                    startIcon={<ListAltIcon />}
                    sx={{
                        textTransform: 'none'
                    }}
                >
                    Group By
                </Button>

            </Stack>
            <Divider />
            <Box mt={2}>
                <TestDND />
            </Box>
        </Box>
    );
}

export default TestKanban;