import React, { useState } from "react";
import { Avatar, Menu, MenuItem, IconButton, ListItemIcon } from "@mui/material";
import { useSelector } from "react-redux";
import { getAvatar } from "../../utils/avatarUtil";
import * as TablerIcons from '@tabler/icons-react';
import { useNavigate } from "react-router-dom";
import * as apiService from "../../api/index";

const CustomNavbarAvatar = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    // Icons from Tabler
    const LogoutIcon = TablerIcons["IconLogout"];
    const ProfileIcon = TablerIcons["IconUser"];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate(`/profile`);
        handleClose();
    };

    const handleLogout = async () => {
        const response = await apiService.authAPI.logout();
        if(response?.status === 200) navigate("/login");
        handleClose();
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small">
                <Avatar
                    sx={{
                        height: 30,
                        width: 30,
                    }}
                    alt="User Name"
                    src={getAvatar(currentUser?.id, currentUser?.avatar)}
                />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <ProfileIcon size={20} />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon size={20} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
};

export default CustomNavbarAvatar;
