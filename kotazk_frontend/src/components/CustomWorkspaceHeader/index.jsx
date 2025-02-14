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
import WorkSpaceMember from "../../pages/WorkSpaceMember";
import CustomDialogForManage from "../CustomDialogForManage";
import { getAvatar } from "../../utils/avatarUtil";
import CustomNotificationList from "../CustomNotificationList";

const CustomWorkspaceHeader = () => {
    const theme = useTheme();
    const AddIcon = allIcons["IconPlus"];
    const ShareIcon = allIcons["IconShare"];
    const SettingIcon = allIcons["IconSettings"];
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [members, setMembers] = useState([]);

    const [open, setOpen] = useState(false);
    const [maxWidth, setMaxWidth] = useState("sm");
    const [children, setChildren] = useState(<WorkSpaceMember />);

    useEffect(() => {
        if (workspace)
            membersFetch();
    }, [workspace]);

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
                    value: "WORK_SPACE",
                    values: []
                }
            ],
        };

        const response = await apiService.memberAPI.getPageByWorkspace(workspace?.id, memberFilter)
        if (response?.data)
            setMembers(response?.data?.content);

    }

    return (
        <Box>
            <Stack direction='row' spacing={3} alignItems="center">
                <Stack flexGrow={1} direction='row' spacing={3} alignItems="center">
                    <Stack direction='row' spacing={2} alignItems='center'>
                        {/* <CustomColorIconPicker /> */}
                        <Typography
                            variant="h5"
                            fontWeight={650}
                        >
                            {workspace?.name}
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
                                key={member?.id}
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
                            onClick={() => { setMaxWidth("sm"); setOpen(true); setChildren(<WorkSpaceMember />); }}
                        >
                            Share
                        </Button>
                    </Box>
                    {/* <Box>
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
                    </Box> */}
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

export default CustomWorkspaceHeader;