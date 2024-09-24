import React, { useState } from 'react';
import { Box, Stack, Typography } from "@mui/material";
import { taskTypeIconsList } from "../../utils/iconsListUtil";
import CustomColorIconPicker from "../CustomColorIconPicker";

const CustomTaskType = ({ taskType, changeable, displayTextOnHoverOnly }) => {
  const [hover, setHover] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Stack direction='row' spacing={2} alignItems='center'>
        <CustomColorIconPicker changeable={changeable} icons={taskTypeIconsList} />

        <Typography
          variant="body1"
          fontWeight={500}
          sx={{
            display: displayTextOnHoverOnly && !hover ? 'none' : 'block', // Show or hide based on hover
          }}
        >
          {taskType.name}
        </Typography>
      </Stack>
    </Box>
  );
};

export default CustomTaskType;
