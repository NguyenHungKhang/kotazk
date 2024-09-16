import React, { useState } from 'react';
import {
  Stack,
  Chip,
  IconButton,
  Popover,
  Checkbox,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const labelsData = [
  { id: 1, name: 'Label 1', color: '#ffcc80' },
  { id: 2, name: 'Label 2', color: '#90caf9' },
  { id: 3, name: 'Label 3', color: '#a5d6a7' },
  { id: 4, name: 'Label 4', color: '#a5d6a7' },
  { id: 5, name: 'Label 5', color: '#a5d6a7' },
  { id: 6, name: 'Label 6', color: '#a5d6a7' },
  { id: 7, name: 'Label 7', color: '#a5d6a7' },
  { id: 8, name: 'Label 8', color: '#a5d6a7' },
  { id: 9, name: 'Label 9', color: '#a5d6a7' },
  // Add more labels as needed
];

const LabelComponent = () => {
  const theme = useTheme();
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [labels, setLabels] = useState(labelsData);

  // Open and close popover
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  // Handle checking and unchecking labels
  const handleToggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  // Filter labels based on search term
  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Stack displaying selected labels */}
      <Stack flexWrap='wrap' gap={0.5} direction="row" spacing={0.5} alignItems="center">
        <IconButton onClick={handleOpenPopover} size="small">
          <AddIcon fontSize="small" />
        </IconButton>
        {selectedLabels.map((label) => (

          <Box
            key={label.id}
            sx={{
              borderRadius: 2,
              backgroundColor: label.color,
              px: 2,
              py: 1
            }}
          >
            <Typography variant='body1' style={{
              color: theme.palette.getContrastText(label.color),
            }}>
              {label.name}
            </Typography>
          </Box>
        ))}

        {/* Add button to trigger popover */}

      </Stack>

      {/* Popover with search bar and label list */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ padding: '8px', width: '250px' }}>
          {/* Search bar */}
          <TextField
            placeholder="Search Labels"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: 2 }}  // Smaller margin
          />

          {/* List of labels with checkboxes */}
          <Box
            sx={{
              p: 1,
              maxHeight: 300,
              overflowY: 'auto',
              borderRadius: 2,
              border: "1px solid",
              borderColor: theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]
            }}
          >
            <List dense>
              {filteredLabels.map((label) => (
                <ListItem
                  key={label.id}
                  sx={{
                    py: 0,
                    px: 1
                  }}
                  onClick={() => handleToggleLabel(label)}
                  dense
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Checkbox
                      sx={{ py: 0 }}
                      edge="start"
                      disableRipple
                      checked={selectedLabels.some((l) => l.id === label.id)}
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          borderRadius: 2,
                          backgroundColor: label.color,
                          px: 2,
                          py: 1
                        }}
                      >
                        <Typography variant='body1' style={{
                          color: theme.palette.getContrastText(label.color),
                        }}>
                          {label.name}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Button to create a new label */}
          <Button variant="contained" fullWidth size="small" sx={{ mt: 2 }}>
            Create Label
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default LabelComponent;
