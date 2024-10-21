import React, { useState } from 'react';
import { Box, Card, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Stack, Select, MenuItem, IconButton, Button, Pagination, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import * as TablerIcons from '@tabler/icons-react';
import { getSecondBackgroundColor } from '../../utils/themeUtil';

const members = [
    {
        id: 1,
        user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        avatarUrl: '',
        role: { id: 1, name: 'Admin' }
    },
    {
        id: 2,
        user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
        avatarUrl: '',
        role: { id: 2, name: 'Editor' }
    }
];


const memberRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Viewer' }
];

const Invitation = () => {
    return (
        <Card
            sx={{
                boxShadow: 0,
                height: '100%'
            }}
        >
            <Stack direction={'column'} height={'100%'}>
                <Box
                    px={6}
                    pt={6}
                    pb={4}
                >
                    <Typography fontWeight={650} variant='h5'>
                        Join requests
                    </Typography>
                </Box>
                <Box flexGrow={1}>
                    <JoinRequestTab />
                </Box>
                <Box p={6} display={'flex'} justifyContent={'center'} width={'100%'} alignSelf={"flex-end"}>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                </Box>
            </Stack>
        </Card>
    );
}

function JoinRequestTab() {
    const [value, setValue] = React.useState('1');
    const theme = useTheme();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [roles, setRoles] = useState(memberRoles);

    const SaveIcon = TablerIcons["IconDeviceFloppy"]
    const InviteIcon = TablerIcons["IconUserPlus"]
    const ApproveIcon = TablerIcons["IconCheck"];

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="success">
                        <Tab label="Pending" value="1" />
                        <Tab label="Waiting" value="2" />
                        {/* <Tab label="Banned" value="3" /> */}
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <TextField
                        size='small'
                        placeholder='Typing name or email for searching...'
                        fullWidth
                    />
                    <Typography variant="h6" fontWeight={650} my={2}>
                        Requests
                    </Typography>
                    <List dense>
                        {members.map((member) => (
                            <ListItem key={member.id}
                                secondaryAction={
                                    <Stack direction='row' spacing={2} alignItems="center">
                                        <Box bgcolor={getSecondBackgroundColor(theme)} px={4} py={1} borderRadius={10}>
                                            {/* <Select
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
                                            </Select> */}
                                            <Typography variant='body2'>
                                                {member.role.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton size='small' color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Button size={'small'} variant='contained' startIcon={<ApproveIcon />}>
                                                    Approve
                                                </Button>
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


                </TabPanel>
                <TabPanel value="2">
                <TextField
                        size='small'
                        placeholder='Typing name or email for searching...'
                        fullWidth
                    />
                    <Typography variant="h6" fontWeight={650} my={2}>
                        Requests
                    </Typography>
                    <List dense>
                        {members.map((member) => (
                            <ListItem key={member.id}
                                secondaryAction={
                                    <Stack direction='row' spacing={2} alignItems="center">
                                        <Box bgcolor={getSecondBackgroundColor(theme)} px={4} py={1} borderRadius={10}>
                                            {/* <Select
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
                                            </Select> */}
                                            <Typography variant='body2'>
                                                {member.role.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton size='small' color="secondary">
                                                    <DeleteIcon />
                                                </IconButton>
                                                {/* <Button size={'small'} variant='contained' startIcon={<ApproveIcon />}>
                                                    Approve
                                                </Button> */}
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


                </TabPanel>
                {/* <TabPanel value="3">Item Three</TabPanel> */}
            </TabContext>
        </Box>
    );
}


export default Invitation;