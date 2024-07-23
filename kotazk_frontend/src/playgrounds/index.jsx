import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Avatar, Stack, Grid, Button, Tabs, Tab } from '@mui/material';
import { useTheme, alpha } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UnfoldLessTwoToneIcon from '@mui/icons-material/UnfoldLessTwoTone';
import Chip from '@mui/material/Chip';
import ReorderIcon from '@mui/icons-material/Reorder';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import CustomTab from '../components/CustomTab';
import StarIcon from '@mui/icons-material/Star';

const drawerWidth = 240;

function Playground(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const theme = useTheme();
    const greyColor = theme.palette.grey[300];

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <Box borderRadius={5}>
            <Stack direction='row' spacing={2} alignItems='center' m={4}>
                <Avatar sx={{ width: 35, height: 35, fontSize: 20 }}>L</Avatar>
                <Typography variant='h5'>
                    Logo
                </Typography>
            </Stack>
            <Stack direction='row' spacing={2} alignItems='center' m={4}>
                <Avatar sx={{ width: 30, height: 30, fontSize: 15 }}>H</Avatar>
                <Typography variant='body2'>
                    Nguyen Hung Khang
                </Typography>
            </Stack>
            <Divider variant='middle' />
            <List dense={true}>
                {['Home', 'Workspace', 'Project', 'Favorite'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider variant='middle' />
            <List dense={true}>
                {['Table', 'Calendar'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider variant='middle' />
            <List dense={true}>
                {['Workspace2', 'Workspace1'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Box
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Project
                        </Typography>
                    </Toolbar>
                </Box>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            top: 0,
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        // p: 4, 
                        height: '100vh',
                        width: {
                            sm: `calc(100% - ${drawerWidth}px)`
                        },
                        backgroundImage: 'url(https://t4.ftcdn.net/jpg/05/79/25/43/360_F_579254301_VQ75mtrG9AP45Txrd76TG2xatiBqqms2.jpg)',
                        overflow: 'hidden',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <Toolbar />
                    <Card
                        sx={{
                            m: 2,
                            // bgcolor: alpha(theme.palette.background.default, 0.9),
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <CardContent>


                            <Stack direction='row' spacing={4} alignItems='center'>
                                <Stack flexGrow={1} direction='row' spacing={4} alignItems='center'>
                                    <Avatar
                                        sx={{
                                            borderRadius: "15px !important",
                                            width: 50,
                                            height: 50,
                                            bgcolor: theme.palette.primary.main
                                        }}
                                    >
                                        <ReorderIcon />
                                    </Avatar>
                                    <Stack direction="column">
                                        <Typography variant='body2' color={theme.palette.text.secondary}>
                                            Breadcum here
                                        </Typography>
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                            <Typography variant='h6' fontWeight='bold'>
                                                Project name
                                            </Typography>
                                            <IconButton size="small">
                                                <MoreHorizIcon fontSize='inherit' />
                                            </IconButton>
                                            <IconButton size="small">
                                                <StarIcon sx={{color: 'yellow'}} />
                                            </IconButton>

                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                <Avatar sx={{
                                                    width: 30,
                                                    height: 30
                                                }}>
                                                    1
                                                </Avatar>
                                                <Avatar sx={{
                                                    width: 30,
                                                    height: 30
                                                }}>
                                                    2
                                                </Avatar>
                                                <Avatar sx={{
                                                    width: 30,
                                                    height: 30
                                                }}>
                                                    3
                                                </Avatar>
                                                <Button size='small' color='primary' variant='outlined' startIcon={<AddIcon />}
                                                    sx={{
                                                        borderRadius: 50
                                                    }}
                                                >
                                                    Add Member
                                                </Button>
                                            </Stack>
                                        </Stack>


                                    </Stack>
                                </Stack>

                                <Avatar
                                    sx={{
                                        width: 30,
                                        height: 30
                                    }}
                                >
                                    H
                                </Avatar>
                                <Box>
                                    <Button size='small' variant='contained' startIcon={<AutoAwesomeTwoToneIcon />}>
                                        Customize
                                    </Button>
                                </Box>
                                <Box>
                                    <Button size='small' variant='contained' color='secondary' startIcon={<ShareTwoToneIcon />}>
                                        Share
                                    </Button>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{
                        m: 2,
                        bgcolor: 'background.paper'
                    }}>
                        <CustomTab />
                    </Card>
                    <Box p={2}>
                        <Stack direction='column' spacing={2}>

                            <Stack direction='row' spacing={4}>
                                <Box bgcolor={theme.palette.background.default} borderRadius={2}>
                                    <Card sx={{
                                        p: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        maxWidth: 280
                                    }}>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <Box flexGrow={1}>
                                                <Stack direction='row' alignItems='center' flexGrow={1} spacing={1} sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 1, px: 1.5, width: 'fit-content', borderRadius: 1 }}>
                                                    <RadioButtonUncheckedIcon fontSize='small' />
                                                    <Typography variant='body2' fontWeight='bold'>
                                                        To do
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <IconButton size="small">
                                                <UnfoldLessTwoToneIcon fontSize='inherit' />
                                            </IconButton>
                                            <IconButton size="small">
                                                <MoreHorizIcon fontSize='inherit' />
                                            </IconButton>
                                            <IconButton size="small">
                                                <AddIcon fontSize='inherit' />
                                            </IconButton>

                                        </Stack>

                                        <Stack spacing={2} mt={2}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant='body2' fontWeight='bold'>
                                                        Task name
                                                    </Typography>
                                                    <Typography variant='body2' color={theme.palette.text.secondary}>
                                                        Project name
                                                    </Typography>
                                                    <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
                                                        <Stack direction="row" spacing={1}>
                                                            <Chip
                                                                avatar={<Avatar>H</Avatar>}
                                                                size='small'
                                                                label="Avatar"
                                                                variant="outlined"
                                                            />
                                                        </Stack>

                                                        <Stack direction="row" spacing={1}>
                                                            <Chip
                                                                avatar={<Avatar>H</Avatar>}
                                                                size='small'
                                                                label="Avatar"
                                                                variant="outlined"
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Chip
                                                                avatar={<Avatar>H</Avatar>}
                                                                size='small'
                                                                label="Avatar"
                                                                variant="outlined"
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Chip
                                                                avatar={<Avatar>H</Avatar>}
                                                                size='small'
                                                                label="Avatar"
                                                                variant="outlined"
                                                            />
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Chip
                                                                avatar={<Avatar>H</Avatar>}
                                                                size='small'
                                                                label="Avatar"
                                                                variant="outlined"
                                                            />
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent>

                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent>

                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardContent>

                                                </CardContent>
                                            </Card>
                                            <Button variant='text' sx={{ textTransform: 'none', fontSize: '14px', justifyContent: 'flex-start' }} startIcon={<AddIcon fontSize='small' />}>
                                                Add task
                                            </Button>
                                        </Stack>
                                    </Card>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>


                </Box>
            </Box>
        </Box>
    );
}


export default Playground;
