import {
    Box,
    IconButton,
    Popover,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as TablerIcon from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as apiService from '../../api/index';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from "../../redux/actions/task.action";

function CustomDueTimePicker({ startAt, endAt, taskId }) {
    const theme = useTheme();
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startDate, setStartDate] = useState(startAt ? dayjs(startAt) : null);
    const [endDate, setEndDate] = useState(endAt ? dayjs(endAt) : null);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const ClearIcon = TablerIcon["IconWashDrycleanOff"];

    useEffect(() => {
        setStartDate(startAt ? dayjs(startAt) : null);
        setEndDate(endAt ? dayjs(endAt) : null);
    }, [startAt, endAt, taskId])

    const saveStartDate = async (newValue) => {
        setStartDate(newValue)
        const data = {
            "startAt": newValue,
            "endAt": endAt || "none"
        }
        try {
            const response = await apiService.taskAPI.update(taskId, data);
            if (response?.data) {
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(response?.data))
                else
                    dispatch(addAndUpdateTaskList(response?.data));

                const taskDialogData = {
                    task: response.data
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    const saveEndDate = async (newValue) => {
        setEndDate(newValue)
        const data = {
            "startAt": startAt || "none",
            "endAt": newValue
        }

        try {
            const response = await apiService.taskAPI.update(taskId, data);
            if (response?.data) {
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(response?.data))
                else
                    dispatch(addAndUpdateTaskList(response?.data));

                const taskDialogData = {
                    task: response.data
                };
                dispatch(setTaskDialog(taskDialogData));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    // Open the popover
    const handleOpenPopover = (event) => {
        if (currentMember?.role?.projectPermissions?.includes("SCHEDULE_TASKS")) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const getDateTimeStatusColor = () => {
        const now = dayjs();
        if (now < startDate)
            return "#529CCA";
        else if (now <= endDate)
            return "green";
        else
            return "#FF7369";
    }

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'date-range-popover' : undefined;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                onClick={handleOpenPopover}
                px={2}
                py={2}
                borderRadius={2}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: currentMember?.role?.projectPermissions?.includes("SCHEDULE_TASKS") ? theme.palette.action.hover : null
                    },
                    '&:focus': {
                        bgcolor: currentMember?.role?.projectPermissions?.includes("SCHEDULE_TASKS") ? theme.palette.action.focus : null
                    },
                }}
            >
                <Stack direction='row' spacing={2}>
                    {startDate != null ?
                        <Typography color={getDateTimeStatusColor} fontWeight={500}>
                            {dayjs(startDate).format("HH:mm MM/DD/YYYY")}
                        </Typography>
                        :
                        <Typography color={theme.palette.text.secondary}>
                            --:-- --/--/----
                        </Typography>
                    }
                    <Typography color={theme.palette.text.secondary} fontWeight={500}>
                        -
                    </Typography>
                    {endDate != null ?
                        <Typography color={getDateTimeStatusColor} fontWeight={500}>
                            {dayjs(endDate).format("HH:mm MM/DD/YYYY")}
                        </Typography>
                        :
                        <Typography color={theme.palette.text.secondary}>
                            --:-- --/--/----
                        </Typography>
                    }
                </Stack>
            </Box>
            <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack p={4} spacing={3}>
                    <Box>
                        <Stack direction='row' spacing={2} alignItems='center' mb={1}>
                            <Typography flexGrow={1} variant='body1' fontWeight={500}>
                                Start Date-Time
                            </Typography>
                            <Tooltip title="Clear start date-time" placement="top">
                                <IconButton size='small' onClick={(e) => saveStartDate(null)}>
                                    <ClearIcon size={16} color={theme.palette.error.main} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Stack direction='row' spacing={2}>
                            <DateTimePicker
                                value={startDate}
                                onChange={saveStartDate}
                                renderInput={(params) => <TextField {...params} />}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </Stack>
                    </Box>
                    <Box>
                        <Stack direction='row' spacing={2} alignItems='center' mb={1}>
                            <Typography flexGrow={1} variant='body1' fontWeight={500}>
                                End Date-Time
                            </Typography>
                            <Tooltip title="Clear end date-time" placement="top">
                                <IconButton size='small' onClick={(e) => saveEndDate(null)}>
                                    <ClearIcon size={16} color={theme.palette.error.main} />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Stack direction='row' spacing={2}>
                            <DateTimePicker
                                value={endDate}
                                onChange={saveEndDate}
                                renderInput={(params) => <TextField {...params} />}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </Stack>
                    </Box>

                </Stack>


            </Popover>

        </LocalizationProvider>
    );
}

export default CustomDueTimePicker;
