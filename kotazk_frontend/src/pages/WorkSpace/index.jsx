import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Button, TextField, Card, CardContent, Grid,
  Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon, Star as StarIcon } from '@mui/icons-material';

const workspaces = [
  { name: 'Autodesk Inc.', owner: 'International Tax', icon: '📁', members: 3 },
  { name: 'Adobe Inc.', owner: 'Audit Engagement', icon: '📂', members: 5 },
  { name: 'HP Inc.', owner: 'Risk Assurance Engagement', icon: '📁', members: 8 },
  // Add more workspaces as needed
];

const WorkSpace = () => {
  return (
    <div>
      {/* Header/Navbar */}
      <AppBar position="static" style={{ backgroundColor: '#fff', color: '#000' }}>
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
        {/* Search Bar */}
        <Box display="flex" justifyContent="center" marginBottom={4}>
          <TextField
            placeholder="Search"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            style={{ maxWidth: 600 }}
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
