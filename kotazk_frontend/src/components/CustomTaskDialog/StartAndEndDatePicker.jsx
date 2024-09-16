import React, { useState } from 'react';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers';

function StartAndEndDatePicker() {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Open and close the dialog
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    // Open the popover
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
                    '&:hover': {
                        bgcolor: theme.palette.action.hover
                    },
                    '&:focus': {
                        bgcolor: theme.palette.action.focus
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
                <Stack sx={{ padding: '16px' }} direction='row' align spacing={2}>
                    <DateTimePicker
                        label="Start Date-Time"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DateTimePicker
                        label="End Date-Time"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
            </Popover>

        </LocalizationProvider>
    );
}

export default StartAndEndDatePicker;
