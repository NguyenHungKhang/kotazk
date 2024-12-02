<<<<<<< HEAD
import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Button, TextField, Card, CardContent, Grid,
  Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  useTheme
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon, Star as StarIcon } from '@mui/icons-material';

const workspaces = [
  { name: 'Autodesk Inc.', owner: 'International Tax', icon: '📁', members: 3 },
  { name: 'Adobe Inc.', owner: 'Audit Engagement', icon: '📂', members: 5 },
  { name: 'HP Inc.', owner: 'Risk Assurance Engagement', icon: '📁', members: 8 },
  // Add more workspaces as needed
];

const WorkSpace = () => {
  // Get the current theme to apply colors dynamically
  const theme = useTheme();

  return (
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
        <Typography variant="h6" style={{ margin: '16px 0' }}>
          Recently Viewed
        </Typography>
        <Grid container spacing={2}>
          {workspaces.map((ws, index) => (
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
        </Grid>

        {/* Favourites Section */}
        <Typography variant="h6" style={{ margin: '16px 0' }}>
          Favourites
        </Typography>
        <Grid container spacing={2}>
          {workspaces.slice(0, 3).map((ws, index) => (
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
          My Workspaces
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
              {workspaces.map((ws, index) => (
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

export default WorkSpace;
=======
import { Box, Card, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ListProject from "./ListWorkspace";
import { useParams } from "react-router-dom";
import * as apiService from '../../api/index';
import { useDispatch } from "react-redux";
import { setCurrentWorkspace } from "../../redux/actions/workspace.action";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomWorkspaceHeader from "../../components/CustomWorkspaceHeader";

const Workspace = ({ children }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { workspaceId } = useParams();
    const [open, setOpen] = useState(true);
    // const [workspace, setWorkspace] = useState(null);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const breadcrumbData = [
        {
            "label": workspace?.name,
        },
    ]

    useEffect(() => {
        if (workspaceId != null)
            initalFetch();
    }, [, workspaceId])

    const initalFetch = async () => {
        await apiService.workspaceAPI.getDetailById(workspaceId)
            .then(res => { console.log(res); dispatch(setCurrentWorkspace(res.data)); })
            .catch(err => console.log(err))
    }

    return (
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
            <Stack direction='row' spacing={2} alignItems="stretch" height={"calc(100% - 12px)"}>

                <SideBar open={open} setOpen={setOpen} />
                <Stack
                    display="flex"
                    flexDirection="column"
                    spacing={2}
                    ml={4}
                    flexGrow={1}
                >
                    <Paper
                        sx={{
                            flex: '0 1 auto',
                            px: 4,
                            py: 4,
                            borderRadius: 2,
                            boxShadow: 0
                        }}
                    >
                        <CustomWorkspaceHeader />
                        <CustomBreadcrumb data={breadcrumbData} />
                    </Paper>

                    <Box
                        flexGrow={1}
                        sx={{

                            overflow: 'hidden',
                            width: open ? '86vw' : '94.2vw',
                            transition: 'width 0.3s',

                        }}
                    >
                        {children}
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}

export default Workspace;
>>>>>>> origin/develop
