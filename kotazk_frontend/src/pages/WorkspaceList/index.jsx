import React, { useEffect } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Button, TextField, Card, CardContent, Grid,
    Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    useTheme,
    CardMedia,
    Stack,
    Avatar
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon, Star as StarIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as apiService from '../../api/index'
import { setCurrentWorkspaceList } from '../../redux/actions/workspace.action';
import CustomInvitation from '../../components/CustomInvitation';
import { getWorkspaceCover } from '../../utils/coverUtil';
import { getAvatar } from '../../utils/avatarUtil';
import { useNavigate } from 'react-router-dom';
import CustomMainPageHeader from '../../components/CustomMainPageHeader';
import workspaceListImages from '../../assets/workspace-list.png';
import dayjs from 'dayjs';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import UserTaskDashBoard from './UserTaskDashBoard';

// const workspaces =
// {
//     content: [
//         { name: 'Autodesk Inc.', owner: 'International Tax', icon: '📁', members: 3 },
//         { name: 'Adobe Inc.', owner: 'Audit Engagement', icon: '📂', members: 5 },
//         { name: 'HP Inc.', owner: 'Risk Assurance Engagement', icon: '📁', members: 8 },
//         // Add more workspaces as needed
//     ]
// };

const WorkspaceList = () => {
    const theme = useTheme();
    const workspaces = useSelector((state) => state.workspace.currentWorkspaceList);
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessedWorkspaces = workspaces?.content;
    const myWorkspace = workspaces?.content?.filter(ws => ws.user.id == currentUser?.id);
    useEffect(() => {
        initialFetch();
    }, [dispatch])


    const initialFetch = async () => {
        const data = {
            "filters": [

            ],
        }
        const response = await apiService.workspaceAPI.getPageDetail(data)
        if (response?.data)
            dispatch(setCurrentWorkspaceList(response?.data))
    }

    const handleNavigate = (wsId) => {
        navigate(`/workspace/${wsId}/dashboard`);
    }


    const getTimeOfDay = () => {
        const currentHour = dayjs().hour(); // Get current hour (0-23)

        if (currentHour >= 5 && currentHour < 12) {
            return "Morning"; // 5:00 AM to 11:59 AM
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Afternoon"; // 12:00 PM to 5:59 PM
        } else {
            return "Evening"; // 6:00 PM to 4:59 AM
        }
    };

    return workspaces != null && (

        <Box p={4}
            paddingBottom={"8px !important"}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
                overflowY: 'auto',
                // backgroundImage: `url('https://i.pinimg.com/736x/d1/de/5e/d1de5ede98e95b2a8cc7e71a84f506a2.jpg')`,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #522580, #223799)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Stack spacing={2} height={'100%'}>

                <Paper
                    sx={{
                        px: 4,
                        py: 4,
                        borderRadius: 2,
                        boxShadow: 0
                    }}
                >
                    <CustomMainPageHeader />
                </Paper>

                {/* Main Content */}
                <Paper sx={{ padding: 2, bgcolor: getTimeOfDay() == "Evening" ? "#3c75fa" : "#f0f4ff", color: theme.palette.getContrastText(getTimeOfDay() == "Evening" ? "#3c75fa" : "#f0f4ff") }}>
                    {/* Search Bar with Background Image */}
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        <Box
                            component={'img'}
                            height={280}
                            borderRadius={6}
                            p={4}
                            src={getTimeOfDay() == "Evening" ? "https://i.pinimg.com/originals/99/12/af/9912af0ae2745b5bf82f024a33b5e274.gif" : "https://i.pinimg.com/originals/85/9b/84/859b844d4cb109594eb93c6dfd11e4d1.gif"} />
                        <Box>
                            <Typography variant='h2' fontWeight={650}>
                                Good {getTimeOfDay()}, {currentUser?.lastName + " " + currentUser?.firstName}!
                            </Typography>
                            <Typography mt={2}>
                                We're thrilled to have you on board! Get started by exploring your dashboard to manage tasks and projects. Connect with your team to collaborate and make progress together. Don't forget to personalize your profile and set your preferences.
                            </Typography>
                            <Typography>
                                If you ever need help, our support team is just a click away. We're excited to see the amazing things you'll accomplish here!
                            </Typography>
                            {/* <TextField
                                placeholder="Search workspace"
                                fullWidth
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 2 }} />,
                                    style: {
                                        backgroundColor: getTimeOfDay() === "Evening" ? "#000000" : "#ffffff",
                                        color: getTimeOfDay() === "Evening" ? "#ffffff" : "#000000", // Change text color (white for Evening, black for Day)
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: getTimeOfDay() === "Evening" ? "#ffffff" : "#000000", // Change label color based on time of day
                                    },
                                }}
                                sx={{
                                    maxWidth: 600,
                                    mt: 2,
                                    bgcolor: getTimeOfDay() === "Evening" ? "#3c75fa" : "#f0f4ff", // Background color for the input
                                    color: getTimeOfDay() === "Evening" ? "#ffffff" : "#000000", // Text color for the input
                                    borderRadius: 1, // Optional: to add rounded corners
                                }}
                            /> */}

                        </Box>
                    </Stack>
                </Paper>
                <Box
                    sx={{
                        overflowY: 'auto',
                        flexGrow: 1
                    }}
                >
                    <Box
                        sx={{
                            height: 600,
                            mb: 2
                        }}
                    >
                        <UserTaskDashBoard />
                    </Box>


                    <Paper style={{ padding: '24px', height: '100%' }}>
                        <Typography variant="h6" style={{ margin: '16px 0' }}>
                            My Workspaces
                        </Typography>
                        <Grid container spacing={2}>
                            {myWorkspace?.length == 0 && (
                                <Box px={2} py={4} borderRadius={2} border={'1px dashed'} width={'100%'} borderColor={getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])}>
                                    <Typography color='textSecondary'>
                                        <i>No Workspaces</i>
                                    </Typography>
                                </Box>
                            )}
                            {myWorkspace?.map((ws, index) => (
                                <Grid item xs={12} sm={3} md={2} key={index}>
                                    <Card
                                        onClick={() => handleNavigate(ws.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease-in-out', // Hiệu ứng chuyển tiếp
                                            '&:hover .overlay': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Tối hơn khi hover
                                            },
                                            '&:hover .projectName': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', width: '100%' }}>
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                    zIndex: 1,
                                                    borderRadius: 1,
                                                    transition: 'background-color 0.3s ease-in-out',
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    paddingTop: '56.25%', // Tỉ lệ 16:9
                                                    backgroundImage: `url(${getWorkspaceCover(ws?.id, ws?.cover)})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: 1,
                                                    position: 'relative', // Để stack có thể định vị tuyệt đối bên trong
                                                }}
                                            >
                                                {/* Thông tin project ở trên ảnh */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        zIndex: 2,  // Đảm bảo nội dung nằm trên lớp phủ
                                                        p: 2,
                                                        borderRadius: 2,
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Stack direction={'row'} spacing={1} alignItems={'center'} width={'100%'}>
                                                        <Box flexGrow={1}>
                                                            <Typography
                                                                className='projectName'
                                                                variant="h6"
                                                                fontWeight={650}
                                                                color="white"
                                                            >
                                                                {ws.name}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                                {/* Stack ở dưới cùng của ảnh */}
                                                <Stack
                                                    direction='row'
                                                    spacing={2}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        p: 2,
                                                        zIndex: 2,  // Đảm bảo Stack nằm trên lớp phủ
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 30,
                                                            height: 30,
                                                        }}
                                                        alt={ws.user.lastName}
                                                        src={getAvatar(ws.user.id, ws.user.avatar)}
                                                    >
                                                        {ws.user.lastName.charAt(0)}
                                                    </Avatar>
                                                    <Typography color='#fff' fontWeight={500}>
                                                        {ws.user.lastName + " " + ws.user.firstName}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h6" style={{ margin: '16px 0' }}>
                            Accessed Workspaces
                        </Typography>
                        <Grid container spacing={2}>
                            {accessedWorkspaces?.length == 0 && (
                                <Box px={2} py={4} borderRadius={2} border={'1px dashed'} width={'100%'} borderColor={getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])}>
                                    <Typography color='textSecondary'>
                                        <i>No Workspaces</i>
                                    </Typography>
                                </Box>
                            )}
                            {accessedWorkspaces?.map((ws, index) => (
                                <Grid item xs={12} sm={3} md={2} key={index}>
                                    <Card
                                        onClick={() => handleNavigate(ws.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease-in-out', // Hiệu ứng chuyển tiếp
                                            '&:hover .overlay': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Tối hơn khi hover
                                            },
                                            '&:hover .projectName': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', width: '100%' }}>
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                    zIndex: 1,
                                                    borderRadius: 1,
                                                    transition: 'background-color 0.3s ease-in-out',
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    paddingTop: '56.25%', // Tỉ lệ 16:9
                                                    backgroundImage: `url(${getWorkspaceCover(ws?.id, ws?.cover)})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: 1,
                                                    position: 'relative', // Để stack có thể định vị tuyệt đối bên trong
                                                }}
                                            >
                                                {/* Thông tin project ở trên ảnh */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        zIndex: 2,  // Đảm bảo nội dung nằm trên lớp phủ
                                                        p: 2,
                                                        borderRadius: 2,
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Stack direction={'row'} spacing={1} alignItems={'center'} width={'100%'}>
                                                        <Box flexGrow={1}>
                                                            <Typography
                                                                className='projectName'
                                                                variant="h6"
                                                                fontWeight={650}
                                                                color="white"
                                                            >
                                                                {ws.name}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                                {/* Stack ở dưới cùng của ảnh */}
                                                <Stack
                                                    direction='row'
                                                    spacing={2}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        p: 2,
                                                        zIndex: 2,  // Đảm bảo Stack nằm trên lớp phủ
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 30,
                                                            height: 30,
                                                        }}
                                                        alt={ws.user.lastName}
                                                        src={getAvatar(ws.user.id, ws.user.avatar)}
                                                    >
                                                        {ws.user.lastName.charAt(0)}
                                                    </Avatar>
                                                    <Typography color='#fff' fontWeight={500}>
                                                        {ws.user.lastName + " " + ws.user.firstName}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                </Box>

            </Stack>
        </Box >
    );
};

export default WorkspaceList;