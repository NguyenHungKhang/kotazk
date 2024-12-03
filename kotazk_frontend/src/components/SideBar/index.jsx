import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Stack, alpha, useTheme, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { IconLayoutDashboardFilled, IconSettingsFilled, IconUsers, IconVectorBezier2, IconCloudLock } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import CustomProjectColorIconPicker from "../CustomProjectColorIconPicker";
import * as apiService from "../../api/index"
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentProjectList } from "../../redux/actions/project.action";
import { getAvatar } from "../../utils/avatarUtil";

const SideBar = ({ open, setOpen }) => {
    const theme = useTheme();
    const { projectId } = useParams();
    const [projects, setProjects] = useState([])
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const projectList = useSelector((state) => state.project.currentProjectList);
    const currentUser = useSelector((state) => state.user.currentUser);
    const pinnedProject = projectList?.content?.filter(p => p.isPinned == true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (workspace != null)
            initialFetch();
    }, [workspace]);


    const initialFetch = async () => {
        const data = {
            "sortBy": "name",
            "sortDirectionAsc": true,
            "filters": [
            ]
        }
        await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
            .then(res => { dispatch(setCurrentProjectList(res.data)); })
            .catch(err => console.warn(err))
    }


    const Menus = [
        { title: "Dashboard", icon: <IconLayoutDashboardFilled size={20} /> },
        { title: "Setting", icon: <IconSettingsFilled size={20} /> },
    ];

    return (
        <Box
            bgcolor={theme.palette.background.paper}
            sx={{
                borderRadius: 2,
                width: open ? 240 : 70,
                transition: 'width 0.3s',
            }}>
            <Box bgcolor={alpha("#f5f5fc", 0.07)} height="100%" p={2} borderRadius={4}>
                <Stack
                    direction='column'
                    alignItems='center'
                    spacing={2}
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
                        <Stack direction='row' spacing={2} alignItems='center'>
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
                        </Stack>
                        <ArrowBackIosNewIcon
                            sx={{
                                position: open ? 'block' : 'absolute',
                                top: 8,
                                right: -16,
                                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                                background: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                border: "2px solid",
                                borderColor: theme.palette.text.secondary,
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                            }}
                            fontSize="small"
                            onClick={() => setOpen(!open)}
                        />
                    </Box>
                    <Divider flexItem />
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar
                            // src="https://i.pinimg.com/474x/55/26/85/5526851366d0b5c204c2b63cf1305578.jpg"
                            sx={{
                                width: 30,
                                height: 30,
                            }}
                            alt={currentUser?.lastName}
                            src={getAvatar(currentUser?.id, currentUser?.avatarUrl)}
                        > H</Avatar>
                        {open && (
                            <Box>
                                <Typography variant="body1" sx={{ ml: 2 }} fontWeight={650}>
                                    Nguyen Hung Khang
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 2 }} color={theme.palette.text.secondary}>
                                    {workspace?.name}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                    <Divider flexItem />
                    <List sx={{ width: '100%' }}>
                        {Menus.map((Menu, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    py: 0.5,
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
                        {pinnedProject?.length > 0 &&
                            <Divider flexItem textAlign="left" sx={{ my: 1 }}><strong>Pinned</strong></Divider>
                        }

                        {pinnedProject?.map((project, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    py: 0.5,
                                    mt: 1,
                                    borderRadius: 1,
                                    bgcolor: projectId == project.id ? theme.palette.primary.main : 'transparent',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.5),
                                    }
                                }}
                                component={Link}
                                to={`/project/${project.id}`}
                            >
                                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                    <CustomProjectColorIconPicker />
                                </ListItemIcon>
                                {open && (
                                    <ListItemText
                                        primary={
                                            <Typography noWrap color={projectId == project.id ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}>
                                                {project.name}
                                            </Typography>
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                )}
                            </ListItem>
                        ))}
                        <Divider flexItem textAlign="left" sx={{ my: 1 }}><strong>Project</strong></Divider>
                        {projectList?.content?.map((project, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    py: 0.5,
                                    mt: 1,
                                    borderRadius: 1,
                                    bgcolor: projectId == project.id ? theme.palette.primary.main : 'transparent',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.5),
                                    }
                                }}
                                component={Link}
                                to={`/project/${project.id}`}
                            >
                                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                    <CustomProjectColorIconPicker />
                                </ListItemIcon>
                                {open && (
                                    <ListItemText
                                        primary={
                                            <Typography noWrap color={projectId == project.id ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}>
                                                {project.name}
                                            </Typography>
                                        }
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
