import React, { useEffect, useState } from "react";
import axios from "axios";
import { connectToWebSocket } from "../../websocket/websocket";
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react'
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Box, Stack, Typography, useTheme } from "@mui/material";
import { getCustomTwoModeColor } from "../../utils/themeUtil";
import { useNavigate } from "react-router-dom";

const CustomNotificationList = () => {
    const theme = useTheme();
    const [pagination, setPagination] = useState({
        hasNext: false,
        hasPrevious: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
    });
    const [notifications, setNotifications] = useState([]); // State for notification list
    const [uncheckNotifications, setUncheckNotifications] = useState(0); // State for notification list
    const [stompClient, setStompClient] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null); // State for Popover anchor element
    const navigate = useNavigate();
    const NotReadIcon = TablerIcons["IconPointFilled"];

    useEffect(() => {
        fetchNotifications();

        const client = connectToWebSocket((newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
            setUncheckNotifications((prev) => prev+1);
        });
        setStompClient(client);

        return () => {
            if (client) client.disconnect();
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = { "pageSize": 5, filters: [] };
            const response = await apiService.notificationAPI.getPage(data);
            if (response?.data) {
                const { content, ...pagination } = response?.data;
                setPagination(pagination);
                setNotifications(content);
                setUncheckNotifications(content.filter(item => item.isCheck === false).length)
                console.log(content)
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (id, url) => {
        try {
            const response = await apiService.notificationAPI.read(id);
            if (response?.data) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === id ? { ...notification, isRead: true } : notification
                    )
                );
                navigate(url)
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };


    const handlePagination = async () => {
        if (!pagination.hasNext) return;

        const data = {
            "pageNum": 0,
            "pageSize": pagination.pageSize + 10,
            "filters": []
        }

        const response = await apiService.notificationAPI.getPage(data);
        if (response?.data) {
            const { content, ...pagination } = response?.data;
            setPagination(pagination);
            setNotifications(content);
            setUncheckNotifications(content.filter(item => item.isCheck === false).length)
        }
    }

    const handleClick = async (event) => {
        try {
            setAnchorEl(event.currentTarget);
            const response = await apiService.notificationAPI.check();
            if (response?.data) {
                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        ísCheck: true
                    }))
                );
                setUncheckNotifications(0);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }

    }
    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            <Badge badgeContent={uncheckNotifications} color="error">
                <IconButton
                    onClick={(e) => handleClick(e)}
                    size="small"
                    sx={{
                        bgcolor: theme.palette.primary.main, // Màu nền ban đầu
                        color: theme.palette.primary.contrastText, // Màu text
                        '&:hover': {
                            bgcolor: theme.palette.primary.light, // Màu khi hover
                        },
                        '&:active': {
                            bgcolor: theme.palette.primary.dark, // Màu khi active
                        },
                    }}
                >
                    <NotificationsIcon fontSize="small" />
                </IconButton>
            </Badge>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box
                    bgcolor={getCustomTwoModeColor(theme, theme.palette.grey[100], theme.palette.grey[900])}
                    maxHeight={500}
                    overflow={'auto'}
                    p={2}
                    borderRadius={4}
                >
                    <Stack spacing={1}>
                        {notifications.map((notification, index) => (
                            <Box key={index} bgcolor={theme.palette.background.default} p={2} borderRadius={2} onClick={() => markAsRead(notification?.id, notification?.actionUrl)}
                                borderLeft={!notification.isRead ? "3px solid" : null}
                                borderRight={!notification.isRead ? "3px solid" : null}
                                borderColor={!notification.isRead ? theme.palette.primary.main : 'transparent'}
                            >
                                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                    <Box flexGrow={1}>
                                        <Typography fontWeight={650}>
                                            {notification.title}
                                        </Typography>

                                        <Typography>
                                            {notification.message}
                                        </Typography>
                                    </Box>
                                    {/* <Box>
                                        <NotReadIcon size={30} color={!notification.isRead ? theme.palette.primary.main : 'transparent'} />
                                    </Box> */}
                                </Stack>

                            </Box>
                        ))}
                        {pagination.hasNext == true && (
                            <Button onClick={() => handlePagination()}>
                                See more
                            </Button>
                        )}

                    </Stack>
                </Box>
            </Popover>
        </div>
    );
};

export default CustomNotificationList;
