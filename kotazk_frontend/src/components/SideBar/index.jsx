import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Stack, alpha, useTheme, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemAvatar } from "@mui/material";
import { IconLayoutDashboardFilled, IconSettingsFilled, IconSitemapFilled, IconLogs, IconVectorBezier2, IconCloudLock } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import CustomProjectColorIconPicker from "../CustomProjectColorIconPicker";
import * as apiService from "../../api/index"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentProjectList } from "../../redux/actions/project.action";
import { getAvatar } from "../../utils/avatarUtil";
import { getProjectCover } from "../../utils/coverUtil";

const SideBar = ({ open, setOpen }) => {
    const theme = useTheme();
    const { projectId } = useParams();
    const [projects, setProjects] = useState([])
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const projectList = useSelector((state) => state.project.currentProjectList);
    const currentUser = useSelector((state) => state.user.currentUser);
    const pinnedProject = projectList?.content?.filter(p => p.isPinned == true);
    const pathname = window.location.pathname;
    const isWorkspace = /^\/workspace\/\d+\/dashboard$/.test(pathname);
    const isWorkspaceSetting = /^\/workspace\/\d+\/setting$/.test(pathname);
    const isWorkspaceProjects = /^\/workspace\/\d+\/projects$/.test(pathname);
    const isWorkspaceActivityLog = /^\/workspace\/\d+\/activity-log$/.test(pathname);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (workspace != null)
            initialFetch();
    }, [workspace]);


    const initialFetch = async () => {
        const data = {
            "sortBy": "name",
            "sortDirectionAsc": true,
            "filters": []
        }
        await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
            .then(res => { dispatch(setCurrentProjectList(res.data)); })
            .catch(err => console.warn(err))
    }



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
                        <Stack direction='row' spacing={2} alignItems='center' onClick={() => navigate("/workspace")}>
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
                            src={getAvatar(currentUser?.id, currentUser?.avatar)}
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
                        <ListItem
                            sx={{
                                py: 0.5,
                                mt: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                bgcolor: isWorkspace == true ? theme.palette.primary.main : 'transparent',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                                }
                            }}
                            button
                            onClick={() => navigate(`/workspace/${workspace?.id}/dashboard`)}
                        >
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                <IconLayoutDashboardFilled size={20} color={isWorkspace == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}/>
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary={
                                        <Typography noWrap color={isWorkspace == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}>
                                            Dashboard
                                        </Typography>
                                    }
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </ListItem>

                        <ListItem
                            sx={{
                                py: 0.5,
                                mt: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                bgcolor: isWorkspaceProjects == true ? theme.palette.primary.main : 'transparent',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                                }
                            }}
                            button
                            onClick={() => navigate(`/workspace/${workspace?.id}/projects`)}
                        >
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                <IconSitemapFilled size={20} color={isWorkspaceProjects == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}/>
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary={
                                        <Typography noWrap color={isWorkspaceProjects == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}>
                                            Projects
                                        </Typography>
                                    }
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </ListItem>

                        <ListItem
                            sx={{
                                py: 0.5,
                                mt: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                bgcolor: isWorkspaceSetting == true ? theme.palette.primary.main : 'transparent',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                                }
                            }}
                            button
                            onClick={() => navigate(`/workspace/${workspace?.id}/setting`)}
                        >
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                <IconSettingsFilled size={20} color={isWorkspaceSetting == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}/>
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary={
                                        <Typography noWrap color={isWorkspaceSetting == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}>
                                            Setting
                                        </Typography>
                                    }
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </ListItem>

                        <ListItem
                            sx={{
                                py: 0.5,
                                mt: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                bgcolor: isWorkspaceActivityLog == true ? theme.palette.primary.main : 'transparent',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                                }
                            }}
                            button
                            onClick={() => navigate(`/workspace/${workspace?.id}/activity-log`)}
                        >
                            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                <IconLogs size={20} color={isWorkspaceActivityLog == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}/>
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary={
                                        <Typography noWrap color={isWorkspaceActivityLog == true ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary}>
                                            Activity Log
                                        </Typography>
                                    }
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </ListItem>

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
                                    <Box sx={{ position: 'relative', width: 30 }}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                paddingTop: '56.25%', // Tỉ lệ 16:9
                                                backgroundImage: `url(${getProjectCover(project?.id, project?.cover)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: 1,
                                                position: 'relative', // Để stack có thể định vị tuyệt đối bên trong
                                            }}
                                        />
                                    </Box>
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
                                    <Box sx={{ position: 'relative', width: 30 }}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                paddingTop: '56.25%', // Tỉ lệ 16:9
                                                backgroundImage: `url(${getProjectCover(project?.id, project?.cover)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: 1,
                                                position: 'relative', // Để stack có thể định vị tuyệt đối bên trong
                                            }}
                                        />
                                    </Box>
                                </ListItemIcon>
                                {/* <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                                  
                                </ListItemIcon> */}
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
