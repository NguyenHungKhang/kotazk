import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TestTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab
          label="Home"
          icon={<HomeIcon />}
          iconPosition="start"
          component="a"
          href="/home"
          sx={{
            textAlign: 'left',
            justifyContent: 'flex-start',
            minWidth: '200px', // Đảm bảo tab đủ rộng
            position: 'relative', // Để vị trí icon dấu ba chấm
            '& .MuiTab-wrapper': {
              display: 'flex',
              alignItems: 'center',
              gap: 1, // Khoảng cách giữa icon và text
            },
            '&:hover': {
              '&::after': {
                content: '""',
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                svg: {
                  fill: 'currentColor',
                },
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '24px',
              height: '24px',
              display: 'none',
              svg: {
                display: 'block',
              },
            },
            '&:hover::after': {
              content: '"..."',
              display: 'inline-block',
              svg: {
                content: '"..."',
              },
            },
          }}
        />
      </Tabs>
    </Box>
  );
}
