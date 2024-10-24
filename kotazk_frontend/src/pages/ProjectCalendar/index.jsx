import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, useTheme } from '@mui/material';
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from "@emotion/styled";
import { getSecondBackgroundColor } from '../../utils/themeUtil';

import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import CustomTaskDialog from '../../components/CustomTaskDialog';
import { useDispatch } from 'react-redux';
import { setTaskDialog } from '../../redux/actions/dialog.action';

export const StyleWrapper = styled.div`
  .fc td {
    background: red;
  }`


const CalendarComponent = () => {

  const theme = useTheme();
  const project = useSelector((state) => state.project.currentProject)
  const [tasks, setTasks] = useState(null);
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
      setTasks(tasksResponse.data.content);
      setDisplayTasks(
        tasksResponse.data.content.map(task => ({
          id: task?.id,
          title: task?.name,
          start: task?.startAt,
          end: task?.endAt,
          allDay: true
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
        '& .fc tbody': {
          bgcolor: getSecondBackgroundColor(theme)
        },
        '& .fc thead': {
          bgcolor: theme.palette.mode == "light" ? theme.palette.background.paper : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
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
        }
      }}
    >
      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin]}
        initialView="dayGridWeek"
        events={displayTasks}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventBackgroundColor={theme.palette.primary.main}
        eventResizableFromStart={true}
        eventResize={handleEventResize}
        eventDrop={handleEventChange}
        editable={true}
        selectable={true}
        height={'100%'}
        datesSet={handleDatesSet}
        headerToolbar={{
          left: 'title',
          right: 'prev today next dayGridWeek,dayGridMonth' // user can switch between the two
        }}
      />
      <CustomTaskDialog />
    </Card>
  );
};

export default CalendarComponent;
