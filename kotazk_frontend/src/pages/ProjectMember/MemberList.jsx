import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Grid, Stack, Card, CardContent, MenuItem, Select, IconButton, Button, Divider, Paper, Box, Typography, TextField, useTheme, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';


const MemberList = () => {
    const theme = useTheme();
    // const [selectedMembers, setSelectedMembers] = useState([]);
    // const [roles, setRoles] = useState(memberRoles);

    const [members, setMembers] = useState(null);
    const [memberRoles, setMemberRoles] = useState(null);
    const [foundedUser, setFoundedUser] = useState(null);
    const [searchUser, setSearchUser] = useState(null);
    const project = useSelector((state) => state.project.currentProject)
    const workSpace = useSelector((state) => state.workspace.currentWorkspace)
    const [searchText, setSearchText] = useState("");

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
            const userFilter = {
                filters: [
                    {
                        key: "user.email",
                        operation: "EQUAL",
                        value: searchUser,
                        values: []
                    }
                ],
            };


            const response = await apiService.memberAPI.getPageByProject(project?.id, userFilter)

            if (response?.data?.content && response?.data?.content?.length == 1) {
                setFoundedUser(response?.data?.content);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // Optionally handle the error, e.g., show a notification or fallback state
        }
    };


    const SaveIcon = TablerIcons["IconDeviceFloppy"]
    const InviteIcon = TablerIcons["IconUserPlus"]

    // const handleSelect = (id) => {
    //     setSelectedMembers((prevSelected) =>
    //         prevSelected.includes(id)
    //             ? prevSelected.filter((memberId) => memberId !== id)
    //             : [...prevSelected, id]
    //     );
    // };

    // const handleSelectAll = () => {
    //     if (selectedMembers.length === members.length) {
    //         setSelectedMembers([]);
    //     } else {
    //         const allIds = members.map((member) => member.id);
    //         setSelectedMembers(allIds);
    //     }
    // };

    // const isSelected = (id) => selectedMembers.includes(id);

    // const handleRoleChange = (id, newRole) => {
    //     setRoles((prevRoles) => ({
    //         ...prevRoles,
    //         [id]: newRole,
    //     }));
    // };

    return (
        <Card
            sx={{
                height: '100% !important',
                p: 4,
                boxShadow: 0,
                borderRadius: 4
            }}
        >
            <Stack direction={'column'} height={'100%'} >
                <Box p={2}>
                    <Typography fontWeight={650} variant='h5'>
                        Project member
                    </Typography>
                </Box>
                <Box
                    p={4}
                    borderRadius={2}
                    bgcolor={getSecondBackgroundColor(theme)}
                >
                    <Typography fontWeight={650} variant='h6'>
                        Invite to team
                    </Typography>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <TextField
                            size='small'
                            fullWidth
                            placeholder='Add Team member name or email...'
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                        <Button
                            variant='outlined'
                            sx={{ whiteSpace: 'nowrap' }}
                            color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                            onClick={() => findUser()}
                        >
                            Find Member
                        </Button>
                    </Stack>

                    {
                        foundedUser && (
                            <Box
                                border={"1px solid"}
                                borderColor={theme.palette.text.disabled}
                                borderRadius={2}
                                mt={2}
                                pr={2}
                            >
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <ListItem
                                        secondaryAction={
                                            <Box>
                                                <Select
                                                    value={memberRoles ? memberRoles[0].id : null}
                                                    size='small'
                                                    variant="standard"
                                                >
                                                    {
                                                        memberRoles?.map((mr) => (
                                                            <MenuItem value={mr.id} >{mr.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </Box>
                                        }
                                    >
                                        <Stack direction='row' spacing={2} alignItems="center"
                                        >
                                            <Box width={'100%'} flexGrow={1}>
                                                <Stack direction='row' spacing={2} alignItems='center'>
                                                    <ListItemAvatar>
                                                        <Avatar />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={'Temp User Name'}
                                                        secondary={'Temp Email'}
                                                    />
                                                </Stack>
                                            </Box>

                                        </Stack>
                                    </ListItem>
                                    <Button
                                        variant='contained'
                                        sx={{ whiteSpace: 'nowrap', px: 6 }}
                                        color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                                        startIcon={<InviteIcon stroke={2} size={18} />}
                                    >
                                        Invite Member
                                    </Button>
                                </Stack>
                            </Box>
                        )
                    }

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
                    <Typography fontWeight={650} variant='h6'>
                        Members (1/1)
                    </Typography>
                    <List dense>
                        {members?.map((member) => (
                            <ListItem key={member.id}
                                secondaryAction={
                                    <Stack direction='row' spacing={2} alignItems="center">
                                        <Box>
                                            <Select
                                                value={member.role.id}
                                                // onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                size='small'
                                                variant="standard"
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
                                                <IconButton size='small' color="success">
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton size='small' color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                }
                            >
                                <Stack direction='row' spacing={2} alignItems="center"
                                >
                                    <Checkbox
                                        edge="start"
                                    // onChange={() => handleSelect(member.id)}
                                    // checked={isSelected(member.id)}
                                    />

                                    <Box width={'100%'} flexGrow={1}>
                                        <Stack direction='row' spacing={2} alignItems='center'>
                                            <ListItemAvatar>
                                                <Avatar src={member.avatarUrl} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={member.user.firstName + ' ' + member.user.lastName}
                                                secondary={member.user.email}
                                            />
                                        </Stack>
                                    </Box>

                                </Stack>
                            </ListItem>
                        ))}
                    </List>

                </Box>
                <Box display={'flex'} justifyContent={'center'} width={'100%'} alignSelf={"flex-end"}>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                </Box>
            </Stack>
        </Card>
    );
};

export default MemberList;
