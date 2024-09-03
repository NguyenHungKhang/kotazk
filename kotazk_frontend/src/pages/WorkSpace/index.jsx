import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, TextField, Card, CardContent, Grid } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';

const workspaces = [
  { name: 'Workspace 1', owner: 'Owner 1', icon: '📁', members: 5 },
  { name: 'Workspace 2', owner: 'Owner 2', icon: '📂', members: 8 },
  // Add more workspaces as needed
];

const WorkSpace = () => {
  return (
    <div>
      {/* Header/Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Logo
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="account">
            <PersonIcon />
          </IconButton>
          <Button color="inherit" startIcon={<AddIcon />}>
            Create Workspace
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <div style={{ padding: 16 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search workspaces"
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />

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

        {/* My Workspaces Section */}
        <Typography variant="h6" style={{ margin: '16px 0' }}>
          My Workspaces
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
      </div>
    </div>
  );
};

export default WorkSpace;
