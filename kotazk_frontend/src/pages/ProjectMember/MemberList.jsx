import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Grid, Stack, Card, CardContent, MenuItem, Select, IconButton, Button, Divider, Paper, Box, Typography, TextField, useTheme, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setDeleteDialog } from '../../redux/actions/dialog.action';
import EmailChipInput from '../../playgrounds/components/EmailChipInput';
import AddProjectMember from './AddProjectMember';


const MemberList = ({ members, setMembers }) => {
    const theme = useTheme();
    // const [selectedMembers, setSelectedMembers] = useState([]);
    // const [roles, setRoles] = useState(memberRoles);

    const [memberRoles, setMemberRoles] = useState(null);
    const [foundedUser, setFoundedUser] = useState(null);
    const [searchUser, setSearchUser] = useState(null);
    const project = useSelector((state) => state.project.currentProject)
    const workSpace = useSelector((state) => state.workspace.currentWorkspace)
    const [searchText, setSearchText] = useState("");
    const RefreshIcon = TablerIcons["IconRefresh"];

    useEffect(() => {
        if (project != null && workSpace != null)
            initialFetch();
    }, [project, workSpace, searchText]);

    const initialFetch = async () => {
        try {
            const memberFilter = {
                filters: [
                    {
                        key: "user.email",
                        operation: "LIKE",
                        value: searchText,
                        values: []
                    },
                    {
                        key: "status",
                        operation: "EQUAL",
                        value: "ACTIVE",
                        values: []
                    }
                ],
            };

            const memberRoleFilter = {
                filters: [
                    // {
                    //     key: "project.id",
                    //     operation: "EQUAL",
                    //     value: project?.id,
                    //     values: []
                    // }
                ],
            };

            // Run both API calls concurrently
            const [memberResponse, memberRoleResponse] = await Promise.all([
                apiService.memberAPI.getPageByProject(project?.id, memberFilter),
                apiService.memberRoleAPI.getPageByProject(memberRoleFilter, project?.id)
            ]);

            // Handle member response
            if (memberResponse?.data?.content) {
                setMembers(memberResponse?.data?.content);
            }

            // Handle member role response
            if (memberRoleResponse?.data?.content) {
                setMemberRoles(memberRoleResponse?.data?.content);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // Optionally handle the error, e.g., show a notification or fallback state
        }
    };



    const findUser = async () => {
        try {
            const response = await apiService.userAPI.getOneByEmail(searchUser)

            if (response?.data) {
                setFoundedUser(response?.data);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const createMember = async () => {
        try {
            const data = {
                projectId: project?.id,
                userId: foundedUser?.id,
                memberFor: "PROJECT",
                memberRoleId: memberRoles[0].id,
            }
            const response = await apiService.memberAPI.create(data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const SaveIcon = TablerIcons["IconDeviceFloppy"]
    const InviteIcon = TablerIcons["IconUserPlus"]

    return (
        <Stack spacing={2}>
            <AddProjectMember currentMembers={members} currentRoleMembers={memberRoles} />
            <Card
                sx={{
                    height: '100% !important',
                    p: 4,
                    boxShadow: 0
                }}
            >
                <Stack direction={'column'} height={'100%'} >
                    <Box p={2}>
                        <Typography fontWeight={650} variant='h5'>
                            Project member
                        </Typography>
                    </Box>

                    <Box p={2}>
                        <TextField
                            size='small'
                            fullWidth
                            placeholder='Typing name or email for searching'
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Box>
                    <Box p={2} flexGrow={1} height={'100%'}>
                        <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
                            <Typography fontWeight={650} variant='h6'>
                                Members
                            </Typography>
                            {/* <IconButton size='small'>
                            <RefreshIcon size={20}/>
                        </IconButton> */}
                        </Stack>

                        <Stack spacing={1}>
                            {members?.map((member) => (
                                <MemberItem key={member.id} member={member} memberRoles={memberRoles} />
                            ))}
                        </Stack>
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} width={'100%'} alignSelf={"flex-end"}>
                        <Pagination count={10} variant="outlined" shape="rounded" />
                    </Box>
                </Stack>
            </Card>
        </Stack>
    );
};

const MemberItem = ({ member, memberRoles }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleOpenDeleteDialog = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete member "${member?.user?.firstName} ${member?.user?.lastName}"?`,
            content:
                `You're about to permanently delete this nember and their comments.`,
            open: true,
            deleteType: "DELETE_MEMBER",
            deleteProps: {
                memberId: member?.id
            }
        }));
    };

    return (
        <Box key={member.id}
            sx={{
                bgcolor: getSecondBackgroundColor(theme),
                p: 2,
                borderRadius: 2
            }}
        >
            <Stack direction='row' spacing={2} alignItems="center"
            >

                <Box width={'100%'} flexGrow={1}>
                    <Stack direction='row' spacing={2} alignItems='center'>

                        <Avatar src={member.avatarUrl}
                            sx={{
                                width: 30,
                                height: 30
                            }} />
                        <Box>
                            <Typography fontWeight={650}>
                                {member.user.firstName + ' ' + member.user.lastName}
                            </Typography>
                            <Typography color={theme.palette.text.secondary}>
                                {member.user.email}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
                <Stack direction='row' spacing={2} alignItems="center">
                    <Box>
                        <Select
                            value={member.role.id}
                            size='small'
                            sx={{
                                p: 0,
                                m: 0
                            }}
                        // variant="standard"
                        >
                            {
                                memberRoles?.map((mr) => (
                                    <MenuItem value={mr.id} >{mr.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </Box>
                    <Box>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={(e) => handleOpenDeleteDialog(e)}
                                size='small'
                                color="secondary"
                            >
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}

export default MemberList;
