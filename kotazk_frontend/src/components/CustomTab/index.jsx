import React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Divider, IconButton, Stack, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // Icon ba chấm ngang

const dummyData = [
    { label: 'Board' },
    { label: 'List' },
    { label: 'Table' },
];

const AntTabs = styled(Tabs)(({ theme }) => ({
    alignItems: 'center',
    minHeight: 0,
}));

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    minHeight: 0,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: '4px', // khoảng cách giữa các icon và label
    [theme.breakpoints.up('sm')]: {
        minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        color: theme.palette.grey[500],
        opacity: 1,
    },
    '&.Mui-selected': {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.getContrastText(theme.palette.background.default),
        fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
        backgroundColor: theme.palette.mode === 'dark' ? '#d1eaff' : '#d1eaff',
    },
}));

export default function CustomTab() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <AntTabs
                        value={value}
                        onChange={handleChange}
                        aria-label="ant example"
                        TabIndicatorProps={{
                            style: { display: 'none' }
                        }}
                    >
                        {dummyData.map((tab, index) => (
                            <AntTab
                                key={index}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HomeIcon sx={{ fontSize: 20 }} />
                                        <span>{tab.label}</span>
                                        {value === index && ( // Chỉ render icon khi tab được chọn
                                            <IconButton
                                                sx={{
                                                    p: 0.5,
                                                    m: 0,
                                                    ml: 1,
                                                    color: theme.palette.background.default,
                                                    transition: 'opacity 0.3s ease',
                                                }}
                                                size='small'
                                                className="more-icon"
                                            >
                                                <MoreHorizIcon fontSize='small' />
                                            </IconButton>
                                        )}
                                    </Box>
                                }
                            />
                        ))}
                    </AntTabs>
                    <Box py={2}>
                        <Divider orientation="vertical" variant="middle" flexItem />
                    </Box>
                    <Box>
                        <IconButton size="small">
                            <AddIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
