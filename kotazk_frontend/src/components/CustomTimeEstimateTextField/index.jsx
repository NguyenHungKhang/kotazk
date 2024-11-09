import { Box, InputAdornment, TextField, Popover, Button, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import * as apiService from "../../api/index";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTaskDialog } from "../../redux/actions/dialog.action";
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList } from "../../redux/actions/task.action";
import { getSecondBackgroundColor } from "../../utils/themeUtil";

const CustomTimeEstimateTextField = ({ currentTimeEstimate, taskId }) => {
    const theme = useTheme();
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [value, setValue] = useState('');
    const [anchorEl, setAnchorEl] = useState(null); // State to track the popover anchor
    const [open, setOpen] = useState(false); // State to control popover visibility
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentTimeEstimate) {
            const totalMinutes = parseFloat(currentTimeEstimate) * 60;
            const currentHours = Math.floor(totalMinutes / 60);
            const currentMinutes = Math.round(totalMinutes % 60);
            setHours(currentHours);
            setMinutes(currentMinutes);
            setValue(currentTimeEstimate);
        }
    }, [currentTimeEstimate]);

    const handleHoursChange = (event) => {
        const newHours = event.target.value;
        if (/^\d*$/.test(newHours)) {
            setHours(newHours);
            updateValue(newHours, minutes);
        }
    };

    const handleMinutesChange = (event) => {
        const newMinutes = event.target.value;
        if (/^\d*$/.test(newMinutes) && (newMinutes === '' || parseInt(newMinutes, 10) < 60)) {
            setMinutes(newMinutes);
            updateValue(hours, newMinutes);
        }
    };

    const updateValue = (newHours, newMinutes) => {
        const hoursDecimal = parseInt(newHours || 0, 10);
        const minutesDecimal = (parseInt(newMinutes || 0, 10) / 60);
        const totalDecimal = (hoursDecimal + minutesDecimal).toFixed(10);
        setValue(totalDecimal);
    };

    const handleSave = async () => {
        setOpen(false);
        if (value == currentTimeEstimate || (currentTimeEstimate == null && value == ''))
            return;
        const data = { timeEstimate: value };
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
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // Set anchor to the clicked element
        setOpen(true); // Open the popover
    };

    const handleClosePopover = () => {
        handleSave(); // Save the changes when closing the popover
    };

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            py: 0,
            '& .MuiSelect-select': {
                py: 1,
                px: 1,
                minHeight: 'auto',
                lineHeight: 'normal',
            },
            '& fieldset': {
                borderColor: 'transparent !important',
            },
            '&:hover fieldset': {
                bgcolor: theme.palette.action.hover,
            },
            '&:focus fieldset': {
                bgcolor: theme.palette.action.focus,
            },
            '& .MuiSelect-icon': {
                display: 'none',
            },
        },
    };

    return (
        <div>
            <Box
                sx={{
                    "&:hover": {
                        bgcolor: getSecondBackgroundColor(theme),
                        cursor: 'pointer',
                        borderRadius: 2
                    }
                }}
                p={2} onClick={handleClick}>
                {value != '' ? `${hours}h ${minutes < 10 ? "0" + minutes : minutes}m` : 'Empty'}
            </Box>

            {/* Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                disableRestoreFocus
            >
                <Box sx={{ p: 2 }}>
                    <TextField
                        value={hours}
                        onChange={handleHoursChange}
                        size="small"
                        type="text"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        placeholder="Hours"
                        variant="outlined"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">h</InputAdornment>,
                        }}
                        sx={{ ...textFieldStyles, mr: 2 }}
                    />
                    <TextField
                        value={minutes}
                        onChange={handleMinutesChange}
                        size="small"
                        type="text"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        placeholder="Minutes"
                        variant="outlined"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                        }}
                        sx={textFieldStyles}
                    />
                </Box>
            </Popover>
        </div>
    );
};

export default CustomTimeEstimateTextField;
