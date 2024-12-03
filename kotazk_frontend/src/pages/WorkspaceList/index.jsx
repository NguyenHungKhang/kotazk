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
        navigate(`/workspace/${wsId}`);
    }

    return workspaces != null && (

        <Box p={4}
            paddingBottom={"8px !important"}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
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
                <Paper style={{ padding: '24px', height: '100%' }}>
                    {/* Search Bar with Background Image */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        marginBottom={4}
                        style={{
                            backgroundImage: `url('https://cellphones.com.vn/sforum/wp-content/uploads/2023/08/hinh-nen-desktop-5.jpg')`, // Replace 'path_to_image' with your image URL
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '200px', // Adjust height as needed
                            borderRadius: '12px',
                            padding: '16px'
                        }}
                    >
                        <TextField
                            placeholder="Search"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            style={{ maxWidth: 600, backgroundColor: '#fff', borderRadius: '8px' }} // White background for input
                        />
                    </Box>

                    <Typography variant="h6" style={{ margin: '16px 0' }}>
                        My Workspaces
                    </Typography>
                    <Grid container spacing={2}>
                        {workspaces?.content?.slice(0, 3).map((ws, index) => (
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
                                                    src={getAvatar(ws.user.id, ws.user.avatarUrl)}
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
            </Stack>
        </Box>
    );
};

export default WorkspaceList;