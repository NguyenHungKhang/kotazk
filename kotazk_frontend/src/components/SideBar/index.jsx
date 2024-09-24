import { useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Stack, alpha, useTheme, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { IconLayoutDashboardFilled, IconSettingsFilled, IconUsers, IconVectorBezier2 } from "@tabler/icons-react";

const SideBar = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    const Menus = [
        { title: "Dashboard", icon: <IconLayoutDashboardFilled size={20} /> },
        { title: "Members", icon: <IconUsers size={20} /> },
        { title: "Setting", icon: <IconSettingsFilled size={20} /> },
        { title: "Project Name", icon: <IconVectorBezier2 size={20} />, gap: true },
    ];

    return (
        <Box
            bgcolor={theme.palette.background.default}
            sx={{
                borderRadius: 4,
                width: open ? 240 : 80,
                transition: 'width 0.3s',
            }}>
            <Box bgcolor={alpha("#f5f5fc", 0.07)} height="100%" p={2}>
                <Stack
                    direction='column'
                    alignItems='center'
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            mb: 2,
                            position: 'relative',
                        }}
                    >
                        <Avatar
                            src="https://i.pinimg.com/474x/55/26/85/5526851366d0b5c204c2b63cf1305578.jpg"
                            sx={{
                                width: 35,
                                height: 35,
                                cursor: 'pointer',
                                transition: 'transform 0.5s',
                                transform: open ? 'rotate(360deg)' : 'none',
                            }}
                        />
                        {open && (
                            <Typography variant="h6" sx={{ ml: 2 }}>
                                Kotazk
                            </Typography>
                        )}
                        <ArrowBackIosNewIcon
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: -12,
                                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                                background: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                border: "2px solid",
                                borderRadius: '50%',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                            }}
                            onClick={() => setOpen(!open)}
                        />
                    </Box>

                    <List sx={{ width: '100%' }}>
                        {Menus.map((Menu, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    mt: Menu.gap ? 4 : 1,
                                    borderRadius: 1,
                                    bgcolor: index === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    }
                                }}
                                button
                            >
                                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                    {Menu.icon}
                                </ListItemIcon>
                                {open && (
                                    <ListItemText
                                        primary={Menu.title}
                                        sx={{ ml: 2 }}
                                    />
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </Box>
        </Box>
    );
};

export default SideBar;
