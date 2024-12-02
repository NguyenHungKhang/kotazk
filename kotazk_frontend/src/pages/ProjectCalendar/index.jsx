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

const ProjectCalendar = () => {

  const theme = useTheme();
  const calendarRef = useRef(null);
  const project = useSelector((state) => state.project.currentProject)
  const tasks = useSelector((state) => state.task.currentTaskList);
  const isGroupedList = useSelector((state) => state.task.isGroupedList);
  const [listTaskView, setListTaskView] = useState("unscheduled")
  const [unScheduledTasks, setUnscheduledTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState(null);
  const [startDayRange, setStartDateRange] = useState(null);
  const [endDayRange, setEndDateRange] = useState(null);
  const [tasksPagination, setTaskPagination] = useState(null);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [showWeekends, setShowWeekends] = useState(true);
  const dispatch = useDispatch();

  const GoToNextIcon = TablerIcons["IconChevronRight"]
  const GoToPrevIcon = TablerIcons["IconChevronLeft"]

  const TaskUncompleteIcon = TablerIcons["IconCircle"]

  useEffect(() => {
    if (project != null)
      initialFetch();
  }, [project])

  useEffect(() => {
    if (tasks != null) {
      setUnscheduledTasks(tasks.filter(ut => ut.startAt == null || ut.endAt == null));
      setScheduledTasks(tasks.filter(ut => ut.startAt != null && ut.endAt != null))
    }
  }, [tasks])

  const initialFetch = async () => {
    const filter = {
      'pageSize': 50,
      filters: [],
    };

    const tasksResponse = await apiService.taskAPI.getPageByProject(project?.id, filter);
    if (tasksResponse?.data) {
      dispatch(setCurrentTaskList(tasksResponse.data.content));
      setDisplayTasks(
        tasksResponse.data.content.map(task => ({
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
  };


  const goToTask = (taskId) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) {
      console.warn("Calendar API not available");
      return;
    }

    const event = calendarApi.getEventById(taskId);
    if (event) {
      calendarApi.gotoDate(event.start);
      event.setProp('borderColor', theme.palette.text.primary);
      setTimeout(() => {
        event.setProp('borderColor', "transparent");
      }, 500);
    } else {
      console.warn("Event not found:", taskId);
    }
  };

  const goToNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  };

  const goToPrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  };

  const goToToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  const changeToMonthView = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('dayGridMonth');
  };

  const changeToWeekWithTimeView = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridWeek');
  };


  const changeToWeekView = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('dayGridWeek');
  };

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


  function handleEventDragStop(info) {
    console.log(info)
  }


  const renderEventContent = (eventInfo) => (
    <Stack direction={'row'} alignItems={'center'} spacing={1} flexWrap='wrap' useFlexGap>
      <TaskUncompleteIcon size={18} />
      <div>{eventInfo.event.title}</div>
      <strong>{eventInfo.timeText}</strong>
    </Stack>
  );

  useEffect(() => {
    if (listTaskView == "unscheduled") {
      const containerEl = document.querySelector("#outside-events");
      new Draggable(containerEl, {
        itemSelector: ".outside-event",
        eventData: (eventEl) => {
          return {
            title: eventEl.innerText,
            publicId: eventEl.getAttribute('publicId'),
          };
        }
      });
    }
  }, [listTaskView]);

  return (
    <Box
      height={'100%'}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: alpha((theme.palette.mode === "light" ? theme.palette.grey[300] : lighten(theme.palette.grey[900], 0.05)), 0.8)
      }}
    >
      <Grid2
        container
        spacing={2}
        height={'100%'}
      >
        <Grid2 item size={2}>
          <Card
            sx={{
              p: 2,
              height: '100%',
              boxShadow: 0
            }}
          >
            <ToggleButtonGroup
              value={listTaskView}
              exclusive
              onChange={(event, newValue) => setListTaskView(newValue)}
              aria-label="List task view"
              size="small"
              fullWidth
            >
              <ToggleButton
                value="unscheduled"
                aria-label="unscheduled"
                sx={{
                  textTransform: 'none',
                  p: 1
                }}
              >
                Unscheduled
              </ToggleButton>
              <ToggleButton
                value="scheduled"
                aria-label="unscheduled"
                sx={{
                  textTransform: 'none',
                  p: 1
                }}
              >
                Scheduled
              </ToggleButton>
            </ToggleButtonGroup>

            {listTaskView == "unscheduled" && (
              <Box>
                <Typography textAlign={'center'} fontWeight={500} my={2}>
                  Unscheduled tasks
                </Typography>

                <Stack component={"ul"} spacing={1} id="outside-events">
                  {unScheduledTasks?.map((t, index) => (
                    <li key={t?.id} publicId={t.id} className="outside-event">
                      <Stack
                        bgcolor={getSecondBackgroundColor(theme)}
                        borderRadius={2}
                        direction={'row'}
                        spacing={2}
                        p={2}
                      >
                        <Typography>
                          {t.name}
                        </Typography>
                      </Stack>
                    </li>
                  ))}
                </Stack>
              </Box>
            )}
            {listTaskView == "scheduled" && (
              <Box>
                <Typography textAlign={'center'} fontWeight={500} my={2}>
                  Scheduled tasks
                </Typography>

                <Stack component={"ul"} spacing={1} id="events">
                  {scheduledTasks?.map((t, index) => (
                    <li key={t?.id} publicId={t.id}>
                      <Stack
                        onClick={() => goToTask(t?.id)}
                        bgcolor={getSecondBackgroundColor(theme)}
                        borderRadius={2}
                        direction={'row'}
                        spacing={2}
                        p={2}
                      >
                        <Typography>
                          {t.name}
                        </Typography>
                      </Stack>
                    </li>
                  ))}
                </Stack>
              </Box>
            )}



          </Card>
        </Grid2>
        <Grid2 item size={10}>
          <Card
            sx={{
              p: 2,
              width: '100%',
              boxShadow: 0,
              mb: 2
            }}
          >
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Stack direction={'row'} spacing={1} alignItems={'center'} flexGrow={1}>
                <Box>
                  <Typography variant="h6" fontWeight={650}>
                    {calendarTitle}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={goToPrev}>
                  <GoToPrevIcon size={16} />
                </IconButton>
                <Button size="small" onClick={goToToday} color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}>
                  Today
                </Button>
                <IconButton size="small" onClick={goToNext}>
                  <GoToNextIcon size={16} />
                </IconButton>
              </Stack>
              <Button size="small" variant="contained" onClick={changeToWeekWithTimeView} color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}>
                Week with time
              </Button>
              <Button size="small" variant="contained" onClick={changeToWeekView} color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}>
                Week
              </Button>
              <Button size="small" variant="contained" onClick={changeToMonthView} color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}>
                Month
              </Button>
              <Divider orientation="vertical" flexItem />
              <Button size="small" variant={showWeekends ? 'contained' : 'outlined'} onClick={() => setShowWeekends(!showWeekends)} color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}>
                {showWeekends ? 'Not show weekends' : 'Show weekends'}
              </Button>
            </Stack>
          </Card>
          <Card
            sx={{
              boxShadow: 0,
              height: `calc(100% - ${theme.spacing(13.5)})`,
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
              plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, multiMonthPlugin]}
              initialView="dayGridWeek"
              events={displayTasks}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventBackgroundColor={darken(theme.palette.primary.main, 0.5)}
              eventResizableFromStart={true}
              eventResize={handleEventResize}
              eventDrop={handleEventChange}
              eventReceive={handleEventReceive}
              nowIndicator={true}
              editable={true}
              selectable={true}
              height={'100%'}
              datesSet={handleTitleSet}
              eventContent={renderEventContent}
              headerToolbar={false}
              weekends={showWeekends}
              droppable
            />
            <CustomTaskDialog />
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ProjectCalendar;
