import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Grid, Stack, Card, CardContent, MenuItem, Select, IconButton, Button, Divider, Paper, Box, Typography, TextField, useTheme, Pagination, ToggleButtonGroup, ToggleButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setDeleteDialog } from '../../redux/actions/dialog.action';
import EmailChipInput from '../../playgrounds/components/EmailChipInput';
import AddWorkspaceMember from './AddWorkspaceMember';


const WorkSpaceMember = () => {
    const theme = useTheme();

    const [memberRoles, setMemberRoles] = useState(null);
    const [foundedUser, setFoundedUser] = useState(null);
    const [searchUser, setSearchUser] = useState(null);
    const [members, setMembers] = useState([]);
    const workSpace = useSelector((state) => state.workspace.currentWorkspace)
    const [searchText, setSearchText] = useState("");
    const RefreshIcon = TablerIcons["IconRefresh"];

    const [memberStatus, setMemberStatus] = React.useState('ACTIVE');

    const handleChangeMemberStatus = (event, statusMember) => {
        if (statusMember != null)
            setMemberStatus(statusMember);
    };

    useEffect(() => {
        if (workSpace != null)
            initialFetch();
    }, [workSpace, searchText, memberStatus]);

    const initialFetch = async () => {
        try {
            const memberFilter = {
                filters: [
                    // {
                    //     key: "user.email",
                    //     operation: "LIKE",
                    //     value: searchText,
                    //     values: []
                    // },
                    {
                        key: "status",
                        operation: "EQUAL",
                        value: memberStatus,
                    },
                    {
                        key: "memberFor",
                        operation: "EQUAL",
                        value: "WORK_SPACE",
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

            const [memberResponse, memberRoleResponse] = await Promise.all([
                apiService.memberAPI.getPageByWorkspace(workSpace?.id, memberFilter),
                apiService.memberRoleAPI.getPageByWorkspace(workSpace?.id, memberRoleFilter)
            ]);

            if (memberResponse?.data?.content) {
                setMembers(memberResponse?.data?.content);
            }

            if (memberRoleResponse?.data?.content) {
                setMemberRoles(memberRoleResponse?.data?.content);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <Stack spacing={2}>
            <AddWorkspaceMember currentMembers={members} currentRoleMembers={memberRoles} />
            <Card
                sx={{
                    height: '100% !important',
                    p: 4,
                    boxShadow: 0
                }}
            >
                <Stack direction={'column'} height={'100%'} >
                    <Box p={2}>
                        <TextField
                            size='small'
                            fullWidth
                            placeholder='Typing email for searching'
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Box>
                    <Box p={2} flexGrow={1} height={'100%'}>
                        <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
                            <Typography fontWeight={650} variant='h6'>
                                Members
                            </Typography>
                            <ToggleButtonGroup
                                color="primary"
                                size='small'
                                value={memberStatus}
                                exclusive
                                onChange={handleChangeMemberStatus}
                                aria-label="Platform"
                            >
                                <ToggleButton size='small' value="ACTIVE" sx={{ textTransform: 'none' }}>Active</ToggleButton>
                                <ToggleButton size='small' value="INVITED" sx={{ textTransform: 'none' }}>Invited</ToggleButton>
                            </ToggleButtonGroup>
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
            title: `Delete member "${member.user ? member.user.email : member.email}"?`,
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
            <Stack direction='row' spacing={2} alignItems="center">
                <Box width={'100%'} flexGrow={1}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar src={member.avatarUrl}
                            sx={{
                                width: 30,
                                height: 30
                            }} />
                        <Box>
                            {
                                member.user ?
                                    <>
                                        <Typography fontWeight={650}>
                                            {member.user.firstName + ' ' + member.user.lastName}
                                        </Typography>
                                        <Typography color={theme.palette.text.secondary}>
                                            {member.user.email}
                                        </Typography>
                                    </> :
                                    <Typography fontWeight={650}>
                                        {member.email}
                                    </Typography>
                            }

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

export default WorkSpaceMember;
