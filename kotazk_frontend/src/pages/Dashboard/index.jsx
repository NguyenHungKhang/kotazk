import React, { useEffect, useState } from 'react';
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
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        initialFetch();
    }, [dispatch, searchText])


    const initialFetch = async () => {
        const data = {
            "filters": [
                { key: "name", value: searchText, operation: "LIKE" },
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

        <Box
            sx={{
                overflowY: 'auto',
                height: '100%'
            }}
        >
            <Stack direction={'row'} height={'100%'} spacing={2}>
                <Stack spacing={2} height={'100%'}>
                    <Paper sx={{ bgcolor: getTimeOfDay() == "Evening" ? "#3c75fa" : "#f0f4ff", color: theme.palette.getContrastText(getTimeOfDay() == "Evening" ? "#3c75fa" : "#f0f4ff"), boxShadow: 0 }}>

                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Box
                                component={'img'}
                                height={200}
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
                            </Box>
                        </Stack>
                    </Paper>


                    <Box
                        sx={{
                            overflowY: 'auto',
                            flexGrow: 1
                        }}
                    >
                        <UserTaskDashBoard />
                    </Box>
                </Stack>
                <Paper sx={{ padding: '24px', height: '100% !important', width: 500, boxShadow: 0 }}>
                    <Stack direction='row' spacing={2} alignItems={'center'}>
                        <Typography variant="h6" >
                            Search:
                        </Typography>
                        <TextField
                            size='small'
                            placeholder='Enter for searching...'
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Stack>

                    <Typography variant="h6" style={{ margin: '16px 0' }}>
                        My Workspaces
                    </Typography>
                    {myWorkspace?.length == 0 && (
                        <Box px={2} py={2} borderRadius={2} border={'1px dashed'} width={'100%'} borderColor={getCustomTwoModeColor(theme, theme.palette.grey[300], theme.palette.grey[800])}>
                            <Typography color='textSecondary'>
                                <i>No Workspaces</i>
                            </Typography>
                        </Box>
                    )}
                    <Stack spacing={2}>

                        {myWorkspace?.map((ws, index) => (

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
                                    },
                                    boxShadow: 0
                                }}
                            >
                                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                    <Box sx={{ position: 'relative', width: 60 }}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                paddingTop: '100%', // 1 : 1
                                                backgroundImage: `url(${getWorkspaceCover(ws?.id, ws?.cover)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: 1,
                                                position: 'relative',
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography
                                            className='projectName'
                                            variant="h6"
                                            fontWeight={650}
                                        >
                                            {ws.name}
                                        </Typography>

                                        <Stack
                                            direction='row'
                                            spacing={2}
                                            alignItems={'center'}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                                alt={ws.user.lastName}
                                                src={getAvatar(ws.user.id, ws.user.avatar)}
                                            >
                                                {ws.user.lastName.charAt(0)}
                                            </Avatar>
                                            <Typography fontWeight={500}>
                                                {ws.user.lastName + " " + ws.user.firstName}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </Paper>
            </Stack>


        </Box >
    );
};

export default WorkspaceList;