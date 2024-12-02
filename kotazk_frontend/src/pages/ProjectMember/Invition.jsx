import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Checkbox, Stack, Select, MenuItem, IconButton, Button, Pagination, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import * as TablerIcons from '@tabler/icons-react';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { useSelector } from 'react-redux';
import * as apiService from '../../api/index';
import { setDeleteDialog } from '../../redux/actions/dialog.action';
import { useDispatch } from 'react-redux';

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

const Invitation = ({ activeMembers, setActiveMembers }) => {


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
                    <JoinRequestTab activeMembers={activeMembers} setActiveMembers={setActiveMembers}/>
                </Box>
                <Box p={6} display={'flex'} justifyContent={'center'} width={'100%'} alignSelf={"flex-end"}>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                </Box>
            </Stack>
        </Card>
    );
}

function JoinRequestTab({ activeMembers, setActiveMembers }) {
    const [value, setValue] = React.useState("AWAITING_ACCEPTANCE");
    const theme = useTheme();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [roles, setRoles] = useState(memberRoles);
    const dispatch = useDispatch();

    const SaveIcon = TablerIcons["IconDeviceFloppy"]
    const InviteIcon = TablerIcons["IconUserPlus"]
    const ApproveIcon = TablerIcons["IconCheck"];

    const [members, setMembers] = useState([]);
    const project = useSelector((state) => state.project.currentProject)
    const workSpace = useSelector((state) => state.workspace.currentWorkspace)
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (project != null && workSpace != null && value != null)
            initialFetch();
    }, [project, workSpace, searchText, value]);
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
                        value: value,
                        values: []
                    }
                ],
            };

            const [memberResponse] = await Promise.all([
                apiService.memberAPI.getPageByProject(project?.id, memberFilter),
            ]);

            if (memberResponse?.data?.content) {
                setMembers(memberResponse?.data?.content);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const approveUser = async (member) => {
        const data = {
            "status": "ACTIVE"
        }
        const response = await apiService.memberAPI.updateStatus(member?.id, data)
        if (response?.data) {
            setActiveMembers([...activeMembers, response?.data])
            setMembers(members?.filter(m => m.id != member.id));
        }
    }

    const handleOpenDeleteDialog = (event, member) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete member "${member?.user?.firstName} ${member?.user?.lastName} - ${member?.user?.email}"?`,
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
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="success">
                        <Tab label="Pending" value="AWAITING_ACCEPTANCE" />
                        <Tab label="Waiting" value="INVITED" />
                    </TabList>
                </Box>
                <TabPanel value="AWAITING_ACCEPTANCE">
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
                                            <Typography variant='body2'>
                                                {member.role.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    onClick={(e) => handleOpenDeleteDialog(e, member)}
                                                    size='small'
                                                    color="secondary"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Button
                                                    onClick={() => approveUser(member)}
                                                    size={'small'}
                                                    variant='contained'
                                                    startIcon={<ApproveIcon />}
                                                >
                                                    Approve
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                }
                            >
                                <Stack direction='row' spacing={2} alignItems="center"
                                >

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
                <TabPanel value="INVITED">
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
                                            <Typography variant='body2'>
                                                {member.role.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    onClick={(e) => handleOpenDeleteDialog(e, member)}
                                                    size='small'
                                                    color="secondary"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                }
                            >
                                <Stack direction='row' spacing={2} alignItems="center">
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
            </TabContext>
        </Box>
    );
}


export default Invitation;