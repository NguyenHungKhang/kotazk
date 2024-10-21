import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, useTheme } from '@mui/material';
import timeGridPlugin from '@fullcalendar/timegrid'
import styled from "@emotion/styled";
import { getSecondBackgroundColor } from '../../utils/themeUtil';


export const StyleWrapper = styled.div`
  .fc td {
    background: red;
  }`


const CalendarComponent = () => {

  const theme = useTheme();
  // Dummy events
  const [events] = useState([
    {
      title: 'Meeting with John',
      start: '2024-10-21T10:00:00',
      end: '2024-10-21T12:00:00',
      backgroundColor: '#ff0000', // Red background for this event
    },
    {
      title: 'Team Lunch',
      start: '2024-10-22T13:00:00',
      end: '2024-10-22T14:00:00',
      backgroundColor: '#00ff00', // Green background for this event
    },
    {
      title: 'Project Deadline',
      start: '2024-10-25',
      backgroundColor: '#0000ff', // Blue background for this event
    },
    {
      title: 'Conference',
      start: '2024-10-28',
      end: '2024-10-30',
      backgroundColor: '#ff9900', // Orange background for this event
    },
  ]);

  // Handle date click
  const handleDateClick = (info) => {
    alert(`Clicked on: ${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    console.log(info)
    alert(`Clicked on event`);
  };

  const handleEventChange = (info) => {
    console.log(info)
    alert(`Change on event`);
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
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        eventBackgroundColor={theme.palette.primary.main}
        editable={true} // Enables event drag and drop
        selectable={true} // Allows selecting a date range
        height={'100%'}
        headerToolbar={{
          left: 'title',
          right: 'prev today next dayGridWeek,dayGridMonth' // user can switch between the two
        }}
      />
    </Card>
  );
};

export default CalendarComponent;
