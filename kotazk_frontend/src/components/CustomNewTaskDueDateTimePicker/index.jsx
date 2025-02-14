import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    Popover,
    TextField,
    Stack,
    Box,
    Typography,
    useTheme,
    IconButton,
    Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentTaskList } from '../../redux/actions/task.action';
import { updateAndAddArray } from '../../utils/arrayUtil';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import * as TablerIcon from '@tabler/icons-react'

function CustomNewTaskDueDateTimePicker({ setNewTaskStartAt, setNewTaskEndAt }) {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const DateTimeIcon = TablerIcon["IconCalendarDue"];
    const ClearIcon = TablerIcon["IconWashDrycleanOff"];

    const saveStartDate = async (newValue) => {
        setStartDate(newValue);
        setNewTaskStartAt(newValue);
    }

    const saveEndDate = async (newValue) => {
        setEndDate(newValue);
        setNewTaskEndAt(newValue);
    }

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget);
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
            <Box onClick={handleOpenPopover}
                px={2}
                py={2}
                borderRadius={2}
                sx={{
                    cursor: 'pointer',
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    '&:hover': {
                        bgcolor: theme.palette.action.hover
                    },
                    '&:focus': {
                        bgcolor: theme.palette.action.focus
                    },
                }}
            >
                {startDate || endDate ?
                    (
                        <Stack direction='row' spacing={2}>
                            <DateTimeIcon stroke={2} size={16} />
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
                    )
                    :
                    <Stack direction='row' spacing={2}>
                        <DateTimeIcon stroke={2} size={16} />
                        <Typography variant='body2' color={theme.palette.text.secondary}>
                            Due date
                        </Typography>
                    </Stack>
                }

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

export default CustomNewTaskDueDateTimePicker;
