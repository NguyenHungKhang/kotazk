import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Typography,
    Avatar,
    Chip,
    useTheme,
    Paper,
    IconButton,
} from '@mui/material';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import * as TablerIcons from '@tabler/icons-react';

const CustomInvitation = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);
    const [members, setMembers] = useState([]);
    const CheckIcon = TablerIcons["IconCheck"];
    const RejectIcon = TablerIcons["IconX"];

    useEffect(() => {
        if (currentUser) {
            fetchInvitations();
        }
    }, [currentUser])

    const fetchInvitations = async () => {
        const response = await apiService.memberAPI.getOwnInvitation();
        if (response?.data) setMembers(response?.data);

    }

    const handleAccept = async (memberId) => {
        const response = await apiService.memberAPI.acceptMember(memberId);
        if (response?.data?.success) await fetchInvitations();
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div>
            {/* Button to open the dialog */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Invitation
            </Button>

            {/* Dialog Component */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={"md"}
                PaperProps={{
                    sx: {
                        boxShadow: 0
                    }

                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: theme.palette.background.default
                    }}
                >Invitation</DialogTitle>
                <DialogContent
                    sx={{
                        bgcolor: theme.palette.background.default
                    }}
                >
                    <Stack spacing={2}>
                        {members.map((member, index) => (
                            <Stack key={member.id} direction={'row'} spacing={2} alignItems={'center'}>
                                <Paper
                                    sx={{
                                        width: 500,
                                        boxShadow: 0,
                                        borderRadius: 1,
                                        borderColor: theme.palette.text.secondary,
                                        border: "1px solid",
                                        p: 2
                                    }}
                                >
                                    <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        justifyContent={'space-between'}
                                        spacing={2}
                                        width={'100%'}
                                    >
                                        <Box>
                                            <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
                                                <Box>
                                                    <Chip
                                                        label={member.memberFor == "WORK_SPACE" ? "Workspace" : "Project"}
                                                        size="small"
                                                        variant="outlined"
                                                        color={member.memberFor == "WORK_SPACE" ? "info" : "success"}

                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography fontWeight={650}>
                                                        {member.memberFor == "WORK_SPACE" ? member.workSpace.name : member.project.name}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                                <Avatar
                                                    sx={{
                                                        width: 30,
                                                        height: 30
                                                    }}
                                                >
                                                    H
                                                </Avatar>
                                                <Box>
                                                    <Typography>
                                                        {
                                                            member.memberFor == "WORK_SPACE" ?
                                                                member.workSpace.user.firstName + " " + member.workSpace.user.lastName :
                                                                member.project.member.user.firstName + " " + member.project.member.user.lastName
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                        <Stack justifyContent={'flex-end'}>
                                            <Stack direction={'row'} spacing={2} alignItems={'center'} mb={2}>
                                                <Box>
                                                    <Typography>
                                                        Role:
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Chip label={member.role.name} size="small" variant="outlined" />
                                                </Box>
                                            </Stack>
                                            <Box>
                                                <Typography color='textSecondary'>
                                                    Invited Date: {dayjs(member.createdAt).format("HH:mm MM/DD/YYYY")}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                    </Stack>
                                </Paper>
                                <Paper
                                    sx={{
                                        border: '1px solid',
                                        boxShadow: 0,
                                        borderColor: theme.palette.text.secondary,
                                        height: '100%',
                                        p: 1
                                    }}
                                >
                                    <Stack alignItems={'stretch'} spacing={3}>
                                        <Box>
                                            <IconButton size='small' color='success' onClick={() => handleAccept(member.id)}>
                                                <CheckIcon size={18} />
                                            </IconButton>
                                        </Box>
                                        <Box>
                                            <IconButton size='small' color='error'>
                                                <RejectIcon size={18} />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>

                        ))
                        }
                        {members.length == 0 && (
                            <Paper
                                sx={{
                                    width: 500,
                                    height: 80,
                                    boxShadow: 0,
                                    borderRadius: 1,
                                    borderColor: theme.palette.text.secondary,
                                    border: "1px dashed",
                                    p: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant='h6' color='textSecondary'>
                                    No Invitation
                                </Typography>
                            </Paper>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions
                    sx={{
                        bgcolor: theme.palette.background.default
                    }}
                >
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CustomInvitation;
