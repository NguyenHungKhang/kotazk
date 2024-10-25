import styled from "@emotion/styled";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import FullCalendar from '@fullcalendar/react';
import { Card, Skeleton, alpha, darken, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getSecondBackgroundColor } from '../../utils/themeUtil';

import { useDispatch, useSelector } from 'react-redux';
import * as apiService from '../../api/index';
import CustomTaskDialog from '../../components/CustomTaskDialog';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import { setCurrentTaskList } from '../../redux/actions/task.action';

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

const CalendarComponent = () => {

  const theme = useTheme();
  const project = useSelector((state) => state.project.currentProject)
  const tasks = useSelector((state) => state.task.currentTaskList)
  const [displayTasks, setDisplayTasks] = useState(null);
  const [startDayRange, setStartDateRange] = useState(null);
  const [endDayRange, setEndDateRange] = useState(null);
  const [tasksPagination, setTaskPagination] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (project != null && startDayRange != null && endDayRange != null)
      initialFetch();
  }, [project, startDayRange, endDayRange])

  const initialFetch = async () => {
    const filter = {
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
          allDay: true,
          backgroundColor: getColorFromInteger(task?.id),
          borderColor: darken(getColorFromInteger(task?.id), 0.3),
          textColor: theme.palette.getContrastText(getColorFromInteger(task?.id))
        }))
      );
    }
  };

  const saveEndDate = async (taskId, range) => {
    const data = {
      "startAt": range.start,
      "endAt": range.end
    }

    try {
      const response = await apiService.taskAPI.update(taskId, data);
      if (response?.data) {
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  // Handle date click
  const handleDateClick = (info) => {
    alert(`Clicked on: ${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    console.log(info);
    console.log(tasks);
    const clickedTask = tasks.find(t => t.id == info.event._def.publicId);
    console.log(clickedTask);
    const taskDialogData = {
      task: clickedTask,
      open: true
    }
    dispatch(setTaskDialog(taskDialogData));
  };

  const handleEventChange = (info) => {
    console.log(info.event._instance.range)
    saveEndDate(info.event._def.publicId, info.event._instance.range)
    alert(`Change on event`);
  };

  const handleDatesSet = (dateInfo) => {
    const { start, end } = dateInfo;
    setStartDateRange(start)
    setEndDateRange(end)
  };

  const handleEventResize = (info) => {
    saveEndDate(info.event._def.publicId, info.event._instance.range)
    console.log(info)
  };

  return (
    <Card
      sx={{
        // borderRadius: 2,
        boxShadow: 0,
        height: '100%',
        display: 'flex', flexDirection: 'column',
        '& .fc .fc-scrollgrid-section-body': {
          bgcolor: theme.palette.mode == "light" ? theme.palette.grey[100] : theme.palette.grey[900]
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
          borderRight: 'none !important'
        },
        '& .fc table': {
          border: 'none !important'
        },
        '& .fc .fc-col-header-cell': {
          py: 3,
          fontSize: 16
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
          fontSize: 12,
          fontWeight: 650,
          borderRadius: 2
        },
        '& .fc .fc-day-today': {
          bgcolor: `${alpha(theme.palette.primary.main, 0.1)} !important`
        }
      }}
    >
      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, multiMonthPlugin]}
        initialView="dayGridWeek"
        events={displayTasks}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventBackgroundColor={theme.palette.primary.main}
        eventResizableFromStart={true}
        eventResize={handleEventResize}
        eventDrop={handleEventChange}
        nowIndicator={true}
        editable={true}
        selectable={true}
        height={'100%'}
        datesSet={handleDatesSet}
        headerToolbar={{
          left: 'title',
          right: 'prev today next timeGridDay,dayGridWeek,dayGridMonth,multiMonthYear' // user can switch between the two
        }}
      />
      <CustomTaskDialog />
    </Card>
  );
};

export default CalendarComponent;
