import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import CustomColorPicker from '../CustomColorPicker';
import CustomIconPicker from '../CustomProjectColorIconPicker';
import * as TablerIcons from '@tabler/icons-react';

export default function CustomAddWorkspaceDialog() {
  const theme = useTheme();
  const [visibility, setVisibility] = React.useState('PUBLIC');
  const WorkspaceIcon = TablerIcons['IconBriefcaseFilled'];
  const [open, setOpen] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState('IconHome');  // Default icon
  const [color, setColor] = React.useState('#000000');  // Default color

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const SelectedIconComponent = TablerIcons[selectedIcon];

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container alignItems="center" xs={10}>
              <Box
                sx={{
                  background: 'linear-gradient(45deg, #FF9800, #FFEB3B)',
                  borderRadius: 2,
                  padding: '4px',
                }}
              >
                <WorkspaceIcon size={24} style={{ color: 'white' }} />
              </Box>
              <Typography variant='h5' fontWeight={650} ml={4}>Add Workspace</Typography>
            </Grid>
            <Grid item xs={2} container justifyContent="flex-end">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText mb={4}>
            Please fill in the details below to add a new workspace.
          </DialogContentText>

          {/* <CustomIconPicker /> */}

          {/* Workspace Name Field */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <InputLabel htmlFor="name">Workspace Name</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                required
                margin='dense'
                size="small"
                id="name"
                name="name"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Visibility Field */}
          <Grid container alignItems="center" spacing={2} mt={1}>
            <Grid item xs={4}>
              <InputLabel htmlFor="visibility">Visibility</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <Select
                labelId="visibility-label"
                id="visibility"
                name="visibility"
                size='small'
                value={visibility}
                fullWidth
                onChange={handleVisibilityChange}
              >
                <MenuItem value="PUBLIC">Public</MenuItem>
                <MenuItem value="PRIVATE">Private</MenuItem>
              </Select>
            </Grid>
          </Grid>

          {/* Description Field */}
          <Grid container alignItems="center" spacing={2} mt={1}>
            <Grid item xs={4}>
              <InputLabel htmlFor="description">Description</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                required
                size="small"
                id="description"
                name="description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>


        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" color="primary" type="submit">
            Add Workspace
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
