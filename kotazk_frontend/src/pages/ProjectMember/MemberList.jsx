import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Grid, Stack, Card, CardContent, MenuItem, Select, IconButton, Button, Divider, Paper, Box, Typography, TextField, useTheme, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';



const MemberList = ({ members, memberRoles }) => {
    const theme = useTheme();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [roles, setRoles] = useState(memberRoles);

    const SaveIcon = TablerIcons["IconDeviceFloppy"]
    const InviteIcon = TablerIcons["IconUserPlus"]

    const handleSelect = (id) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((memberId) => memberId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedMembers.length === members.length) {
            setSelectedMembers([]);
        } else {
            const allIds = members.map((member) => member.id);
            setSelectedMembers(allIds);
        }
    };

    const isSelected = (id) => selectedMembers.includes(id);

    const handleRoleChange = (id, newRole) => {
        setRoles((prevRoles) => ({
            ...prevRoles,
            [id]: newRole,
        }));
    };

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
                        />
                        <Button
                            variant='outlined'
                            sx={{ whiteSpace: 'nowrap' }}
                            color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                        >
                            Find Member
                        </Button>
                    </Stack>


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
                                            value={memberRoles[0].id}
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
                </Box>
                <Box p={2}>
                    <TextField
                        size='small'
                        fullWidth
                        placeholder='Typing name or email for searching'
                    />
                </Box>
                <Box p={2} flexGrow={1} height={'100%'}>
                    <Typography fontWeight={650} variant='h6'>
                        Members (1/1)
                    </Typography>
                    <List dense>
                        {members.map((member) => (
                            <ListItem key={member.id}
                                secondaryAction={
                                    <Stack direction='row' spacing={2} alignItems="center">
                                        <Box>
                                            <Select
                                                value={member.role.id}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value)}
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
                                        onChange={() => handleSelect(member.id)}
                                        checked={isSelected(member.id)}
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
