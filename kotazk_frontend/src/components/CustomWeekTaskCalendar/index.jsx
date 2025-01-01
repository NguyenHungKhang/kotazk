import styled from "@emotion/styled";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import FullCalendar from '@fullcalendar/react';
import { Box, Button, Card, Divider, Grid2, IconButton, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography, alpha, darken, lighten, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { useDispatch, useSelector } from 'react-redux';
import * as apiService from '../../api/index';
import CustomTaskDialog from '../../components/CustomTaskDialog';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import { addAndUpdateGroupedTaskList, addAndUpdateTaskList, setCurrentTaskList } from '../../redux/actions/task.action';
import * as TablerIcons from '@tabler/icons-react'
import Tab from '@mui/material/Tab';

export const StyleWrapper = styled.div`
  .fc td {
    background: red;
  }`


const enhancedIconColors = [
    "#f53d3d", // Notion Red
    "#f53d9f", // Notion Pink
    "#8a3df5", // Notion Purple
    "#0d9af2", // Notion Blue
    "#47ebcd", // Notion Green
    "#FFDC49", // Notion Yellow
    "#FFA344", // Notion Orange
    "#f5743d", // Notion Brown
    "#979A9B", // Notion Grey
];

// Create an array of 100 colors by repeating the enhancedIconColors
const fullColorPalette = Array.from({ length: 100 }, (_, i) =>
    enhancedIconColors[i % enhancedIconColors.length]
);

function getColorFromInteger(num) {
    // Map the integer to the fullColorPalette by taking modulo 100
    const colorIndex = (num - 1) % 100;
    return fullColorPalette[colorIndex];
}

const CustomWeekTaskCalendar = ({ tasks, setTasks }) => {

    const theme = useTheme();
    const calendarRef = useRef(null);
    const isGroupedList = useSelector((state) => state.task.isGroupedList);
    const [unScheduledTasks, setUnscheduledTasks] = useState([]);
    const [scheduledTasks, setScheduledTasks] = useState([]);
    const [displayTasks, setDisplayTasks] = useState(null);
    const [startDayRange, setStartDateRange] = useState(null);
    const [endDayRange, setEndDateRange] = useState(null);
    const [calendarTitle, setCalendarTitle] = useState('');
    const [showWeekends, setShowWeekends] = useState(true);
    const dispatch = useDispatch();

    const TaskUncompleteIcon = TablerIcons["IconCircle"]

    useEffect(() => {
        if (tasks) {
            setDisplayTasks(
                tasks.map(task => ({
                    id: task?.id,
                    title: task?.name,
                    start: task?.startAt,
                    end: task?.endAt,
                    allDay: false,
                    backgroundColor: getColorFromInteger(task?.id),
                    textColor: theme.palette.getContrastText(getColorFromInteger(task?.id))
                }))
            );
        }
    }, [tasks])

    const handleTitleSet = () => {
        const calendarApi = calendarRef?.current?.getApi();
        const viewTitle = calendarApi?.view?.title;
        if (viewTitle) {
            setCalendarTitle(viewTitle);
        }
    };

    useEffect(() => {
        handleTitleSet();
    }, []);

    const saveEndDate = async (taskId, range) => {
        const data = {
            "startAt": range.start,
            "endAt": range.end
        }

        console.log(123);
        try {
            const response = await apiService.taskAPI.update(taskId, data);
            if (response?.data) {
                if (isGroupedList)
                    dispatch(addAndUpdateGroupedTaskList(response?.data))
                else
                    dispatch(addAndUpdateTaskList(response?.data));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }

    const handleDateClick = (info) => {

    };

    const handleEventClick = (info) => {
        const clickedTask = tasks.find(t => t.id == info.event._def.publicId);
        const taskDialogData = {
            task: clickedTask,
            open: true
        }
        dispatch(setTaskDialog(taskDialogData));
    };

    const handleEventChange = (info) => {
        console.log(info)
        saveEndDate(info.event._def.publicId, info.event._instance.range);
    };

    const handleDatesSet = (dateInfo) => {
        const { start, end } = dateInfo;
        setStartDateRange(start)
        setEndDateRange(end)
    };

    const handleEventResize = (info) => {
        saveEndDate(info.event._def.publicId, info.event._instance.range)
    };

    function handleEventReceive(info) {
        saveEndDate(info.event._def.extendedProps.publicId, info.event._instance.range)
        setUnscheduledTasks(unScheduledTasks.filter(ut => ut.id != info.event._def.extendedProps.publicId))
    }

    const renderEventContent = (eventInfo) => (
        <Stack direction={'row'} alignItems={'center'} spacing={1} flexWrap='wrap' useFlexGap>
            <TaskUncompleteIcon size={18} />
            <div>{eventInfo.event.title}</div>
            <strong>{eventInfo.timeText}</strong>
        </Stack>
    );

    return (
        <>
            <Stack height={'100%'}>
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={'bold'}
                        p={2}
                    >
                        Calendar
                    </Typography>
                </Box>
                <Box
                    sx={{
                        boxShadow: 0,
                        flexGrow: 1,
                        height: `100%`,
                        // display: 'flex', flexDirection: 'column',
                        '& .fc .fc-scrollgrid-section-body': {
                            bgcolor: theme.palette.mode == "light" ? theme.palette.grey[100] : theme.palette.grey[900],
                        },
                        '& .fc thead': {
                            bgcolor: theme.palette.mode == "light" ? theme.palette.background.paper : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                        },
                        '& .fc .fc-day': {
                            bgcolor: theme.palette.mode == "light" ? theme.palette.background.default : "#1E1E1E"
                        },
                        '& .fc th, td': {
                            borderColor: theme.palette.mode == "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                        },
                        '& .fc th': {
                            borderLeft: 'none !important',
                            borderRight: 'none !important',
                            borderBottom: 'none !important'
                        },
                        '& .fc table, tr': {
                            border: 'none !important'
                        },
                        '& .fc .fc-col-header-cell': {
                            py: 2,
                            fontSize: 14
                        },
                        '& .fc .fc-toolbar': {
                            px: 4,
                            py: 2,
                            m: 0
                        },
                        '& .fc .fc-toolbar h2': {
                            fontSize: 18,
                            fontWeight: 650
                        },
                        '& .fc .fc-event': {
                            padding: 1,
                            fontSize: 14,
                            fontWeight: 650,
                            borderRadius: 1,
                            border: '2px solid transparent',
                        },
                        '& .fc .fc-day-today': {
                            bgcolor: `${alpha(theme.palette.info.main, 0.2)} !important`,
                        }
                    }}
                >
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
                        initialView="timeGridWeek"
                        events={displayTasks}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        eventBackgroundColor={darken(theme.palette.primary.main, 0.5)}
                        nowIndicator={true}
                        editable={true}
                        selectable={true}
                        height={'100%'}
                        datesSet={handleTitleSet}
                        eventContent={renderEventContent}
                        allDaySlot={false}
                        headerToolbar={{
                            left: 'title', // Navigation buttons
                            right: 'timeGridDay,timeGridWeek', // View selection buttons
                        }}
                    />
                </Box>
            </Stack>
            <CustomTaskDialog />
        </>
    );
};

export default CustomWeekTaskCalendar;
