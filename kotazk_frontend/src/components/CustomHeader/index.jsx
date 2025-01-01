import { Stack, Typography, Box, Avatar, Button, IconButton, AvatarGroup, TextField, InputAdornment, Divider, Badge, darken } from "@mui/material";
import * as allIcons from "@tabler/icons-react"
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CustomDarkModeSwitch from "../CustomDarkModeSwitch";
import CustomColorIconPicker from "../CustomProjectColorIconPicker";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import * as apiService from "../../api/index"
import { getAvatar } from "../../utils/avatarUtil";
import CustomDialogForManage from "../CustomDialogForManage";
import ProjectMember from "../../pages/ProjectMember";
import CustomNotificationList from "../CustomNotificationList";

const CustomHeader = () => {
    const theme = useTheme();
    const AddIcon = allIcons["IconPlus"];
    const ShareIcon = allIcons["IconShare"];
    const SettingIcon = allIcons["IconSettings"];
    const project = useSelector((state) => state.project.currentProject);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [members, setMembers] = useState([]);
    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState("log");
    const [children, setChildren] = useState(<ProjectMember />);

    useEffect(() => {
        if (project)
            membersFetch();
    }, [project]);

    const membersFetch = async () => {
        const memberFilter = {
            sortBy: 'user.lastName',
            sortDirectionAsc: true,
            filters: [
                {
                    key: "status",
                    operation: "EQUAL",
                    value: "ACTIVE",
                    values: []
                },
                {
                    key: "memberFor",
                    operation: "EQUAL",
                    value: "PROJECT",
                    values: []
                }
            ],
        };

        const response = await apiService.memberAPI.getPageByProject(project?.id, memberFilter)
        if (response?.data)
            setMembers(response?.data?.content);

    }

    return (
        <Box>
            <Stack direction='row' spacing={3} alignItems="center">
                <Stack flexGrow={1} direction='row' spacing={3} alignItems="center">
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Typography
                            variant="h5"
                            fontWeight={650}
                        >

                            {project ? project.name : "Project name"}
                        </Typography>
                    </Stack>

                    <AvatarGroup
                        max={5}
                        spacing={6}
                        sx={{
                            '& .MuiAvatar-root': {
                                width: 30,
                                height: 30,
                                fontSize: 14
                            },
                        }}
                    >
                        {members?.map((member) => (
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                }}
                                alt={member?.user?.lastName}
                                src={getAvatar(member?.user?.id, member?.user?.avatar)}
                            >
                                {member?.user?.lastName.substring(0, 1)}
                            </Avatar>
                        ))}
                    </AvatarGroup>
                    {/* <Button
                        component={Link}
                        to={`/project/${project?.id}/member`}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 5
                        }}
                        variant="contained"
                        size="small"
                        startIcon={
                            <AddIcon size={16} />
                        }
                    >
                        Add member
                    </Button> */}
                </Stack>
                <Stack direction='row' spacing={2}>
                    <Box>
                        <Button
                            size='small'
                            variant="outlined"
                            color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                            startIcon={<ShareIcon size={16} />}
                            sx={{
                                textTransform: 'none'
                            }}
                            onClick={() => { setMaxWidth("md"); setOpen(true); setChildren(<ProjectMember />); }}
                        >
                            Share
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            component={Link}
                            to={`/project/${project?.id}/setting`}
                            size='small'
                            variant='contained'
                            color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                            startIcon={<SettingIcon size={16} />}
                            sx={{
                                textTransform: 'none'
                            }}
                        >
                            Setting
                        </Button>
                    </Box>
                </Stack>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Stack direction="row" spacing={2} alignItems="center">
                    <CustomDarkModeSwitch />
                    <CustomNotificationList />
                    <Avatar
                        sx={{
                            width: 30,
                            height: 30
                        }}
                        alt={currentUser?.lastName}
                        src={getAvatar(currentUser?.id, currentUser?.avatar)}
                    >
                        H
                    </Avatar>
                </Stack>
            </Stack>
            <CustomDialogForManage open={open} setOpen={setOpen} children={children} customMaxWidth={maxWidth} />
        </Box>
    );
}

export default CustomHeader;