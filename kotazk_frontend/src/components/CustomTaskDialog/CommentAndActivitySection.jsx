// DialogFooter.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const CommentAndActivitySection = () => {
  const [comment, setComment] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [toggle, setToggle] = useState('comments');
  const [inputHeight, setInputHeight] = useState('48px'); // Default height for TextField

  const handleToggle = (event, newToggle) => {
    if (newToggle) {
      setToggle(newToggle);
    }
  };

  const handleAddComment = () => {
    if (comment) {
      setActivityLog((prevLog) => [...prevLog, comment]);
      setComment('');
    }
  };

  const handleFocus = () => {
    setInputHeight('96px'); // Expand height on focus
  };

  const handleBlur = () => {
    setInputHeight('48px'); // Reset height on blur
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
      <ToggleButtonGroup
        value={toggle}
        exclusive
        onChange={handleToggle}
        sx={{ marginBottom: '16px' }}
      >
        <ToggleButton value="comments">Comments</ToggleButton>
        <ToggleButton value="activity">Activity</ToggleButton>
      </ToggleButtonGroup>

      {toggle === 'comments' && (
        <Box>
          <Typography variant="subtitle1">Add Comment</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
              marginBottom: '8px',
              height: inputHeight,
              transition: 'height 0.3s ease', // Smooth transition
            }}
            multiline // Enable multiline
            rows={1} // Start with 1 row
            maxRows={4} // Limit the maximum number of rows
          />
          <Button onClick={handleAddComment} color="primary">
            Add Comment
          </Button>
        </Box>
      )}

      {toggle === 'activity' && (
        <Box>
          <Typography variant="subtitle1">Activity Log</Typography>
          <Box
            sx={{
              maxHeight: '150px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '8px',
            }}
          >
            {activityLog.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No activity yet.
              </Typography>
            ) : (
              activityLog.map((activity, index) => (
                <Typography key={index} variant="body2">
                  • {activity}
                </Typography>
              ))
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentAndActivitySection;
