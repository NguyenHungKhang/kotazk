import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Grid, Stack, Card, CardContent, MenuItem, Select, IconButton, Button, Divider, Paper, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// const dummyData = [
//     {
//         id: 1,
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         avatarUrl: 'https://i.pravatar.cc/150?img=1',
//         role: 'Admin',
//     },
//     {
//         id: 2,
//         name: 'Jane Smith',
//         email: 'jane.smith@example.com',
//         avatarUrl: 'https://i.pravatar.cc/150?img=2',
//         role: 'Editor',
//     },
//     {
//         id: 3,
//         name: 'Alice Johnson',
//         email: 'alice.johnson@example.com',
//         avatarUrl: 'https://i.pravatar.cc/150?img=3',
//         role: 'Guest',
//     },
// ];

const MemberList = ({ members, memberRoles }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [roles, setRoles] = useState(memberRoles);

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
        <Box
            sx={{
                height: '100%'
            }}
        >
            <List dense>
                <ListItem>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={1}>
                            <Checkbox
                                edge="start"
                                onChange={handleSelectAll}
                                checked={selectedMembers.length === members.length}
                                indeterminate={selectedMembers.length > 0 && selectedMembers.length < members.length}
                            />
                        </Grid>
                        <Grid item xs={3}>Name</Grid>
                        <Grid item xs={3}>Email</Grid>
                        <Grid item xs={4}>Role</Grid>
                        <Grid item xs={1}>Action</Grid>
                    </Grid>

                </ListItem>
                <Divider component="li" />
                {members.map((member) => (
                    <ListItem key={member.id}>
                        <Grid container spacing={2} alignItems="center"
                            sx={{
                                my: 1
                            }}
                        >
                            <Grid item xs={1}>
                                <Checkbox
                                    edge="start"
                                    onChange={() => handleSelect(member.id)}
                                    checked={isSelected(member.id)}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <ListItemAvatar>
                                        <Avatar src={member.avatarUrl} />
                                    </ListItemAvatar>
                                    <ListItemText primary={member.user.firstName + ' ' + member.user.lastName} />
                                </Stack>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemText secondary={member.user.email} />
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    value={member.role.id}
                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                    size='small'
                                >
                                    {
                                        memberRoles?.map((mr) => (
                                            <MenuItem value={mr.id} >{mr.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={1}>
                                <Stack direction="row" spacing={1}>
                                    <IconButton color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default MemberList;
