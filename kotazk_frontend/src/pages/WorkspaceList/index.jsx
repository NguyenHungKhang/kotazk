import React, { useEffect } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Button, TextField, Card, CardContent, Grid,
    Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    useTheme
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon, Star as StarIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as apiService from '../../api/index'
import { setCurrentWorkspaceList } from '../../redux/actions/workspace.action';

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

    useEffect(() => {
        initialFetch();
    }, [dispatch])


    const initialFetch = async () => {
        const data = {
            "filters": [

            ],
        }
        const response = await apiService.workspaceAPI.getPageSumary(data)
        if(response?.data)
            dispatch(setCurrentWorkspaceList(response?.data))
    }

    return workspaces != null && (
        <div>
            {/* Header/Navbar */}
            <AppBar
                position="static"
                style={{
                    backgroundColor: theme.palette.background.paper, // Use theme background color
                    color: theme.palette.text.primary, // Use theme text color
                }}
            >
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Kotazk
                    </Typography>
                    <Button color="inherit" style={{ marginRight: '16px' }}>
                        Switch to Admin
                    </Button>
                    <Button color="inherit" startIcon={<AddIcon />} variant="outlined">
                        Create Workspace
                    </Button>
                    <IconButton edge="end" color="inherit" aria-label="account">
                        <PersonIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container style={{ padding: '24px' }}>
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

                {/* Recently Viewed Section */}
                {/* <Typography variant="h6" style={{ margin: '16px 0' }}>
                    Recently Viewed
                </Typography>
                <Grid container spacing={2}>
                    {workspaces?.content?.map((ws, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{ws.name}</Typography>
                                    <Typography color="textSecondary">{ws.owner}</Typography>
                                    <Typography variant="body2">{ws.icon}</Typography>
                                    <Typography variant="body2">Members: {ws.members}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid> */}

                {/* Favourites Section */}
                <Typography variant="h6" style={{ margin: '16px 0' }}>
                    My Workspaces
                </Typography>
                <Grid container spacing={2}>
                    {workspaces?.content?.slice(0, 3).map((ws, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{ws.name}</Typography>
                                    <Typography color="textSecondary">{ws.owner}</Typography>
                                    <Typography variant="body2">{ws.icon}</Typography>
                                    <Typography variant="body2">Members: {ws.members}</Typography>
                                    <StarIcon style={{ color: '#FFD700', marginTop: '8px' }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* My Workspaces Section */}
                <Typography variant="h6" style={{ margin: '16px 0' }}>
                    Accessable Workspaces
                </Typography>
                <Box display="flex" justifyContent="space-between" marginBottom={2}>
                    <Box>
                        <Button variant="outlined" style={{ marginRight: '8px' }}>
                            List View
                        </Button>
                        <Button variant="outlined">
                            Grid View
                        </Button>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />}>
                        Create New
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Workspace</TableCell>
                                <TableCell>Users</TableCell>
                                <TableCell>Clients</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell>User Count</TableCell>
                                <TableCell>Apps & Services</TableCell>
                                <TableCell>Data & Assets</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workspaces?.content?.map((ws, index) => (
                                <TableRow key={index}>
                                    <TableCell>{ws.name}</TableCell>
                                    <TableCell>{ws.members}</TableCell>
                                    <TableCell>Client {index + 1}</TableCell>
                                    <TableCell>Inventory</TableCell>
                                    <TableCell>{ws.members}</TableCell>
                                    <TableCell>03</TableCell>
                                    <TableCell>08</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
};

export default WorkspaceList;