import React, { useEffect, useState } from 'react';
import { GanttComponent, Inject, Edit, Selection, ColumnsDirective, ColumnDirective, RowDD } from '@syncfusion/ej2-react-gantt';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import * as apiService from '../../api/index';
import { updateAndAddArray } from '../../utils/arrayUtil';
import { setCurrentTaskList } from '../../redux/actions/task.action';

const Gantt = () => {
  const tasks = useSelector((state) => state.task.currentTaskList);
  const project = useSelector((state) => state.project.currentProject);
  const filters = useSelector((state) => state.filter.currentFilterList);

  const dispatch = useDispatch();

  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - currentDayOfWeek + 1);

  const [projectStartDate, setProjectStartDate] = useState(
    new Date(startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - 100))
  );
  const [projectEndDate, setProjectEndDate] = useState(
    new Date(startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 50))
  );


  const [view, setView] = useState('Week');

  useEffect(() => {
    if (project != null && projectStartDate != null && projectEndDate != null) {
      console.log(projectStartDate)
      console.log(projectEndDate)
      initialFetch();
    }
  }, [project, filters, projectStartDate, projectEndDate]);

  useEffect(() => {
    const handleScroll = () => {
      const chartPane = document.querySelector('.e-chart-scroll-container'); // Find the chart pane

      if (chartPane) {
        const scrollLeft = chartPane.scrollLeft;
        const clientWidth = chartPane.clientWidth;
        const scrollWidth = chartPane.scrollWidth; // Get the current scrollWidth

        // Check if scrolled to the start
        if (scrollLeft === 0) {
          updateProjectDates(-2); // Subtract 2 units based on the current view
        }

        // Check if scrolled to the end
        if (scrollLeft + clientWidth >= scrollWidth) {
          updateProjectDates(2); // Add 2 units based on the current view
        }
      }
    };

    const chartPaneElement = document.querySelector('.e-chart-scroll-container'); // Select the chart pane element
    if (chartPaneElement) {
      chartPaneElement.addEventListener('scroll', handleScroll); // Attach the scroll event
    }

    // Cleanup event listener on unmount
    return () => {
      if (chartPaneElement) {
        chartPaneElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const updateProjectDates = (increment) => {
    const unit = view === 'Day' ? 1 : view === 'Week' ? 7 : 30; // Determine the unit based on view
    const daysToAdd = unit * increment; // Calculate days to add or subtract

    if (increment < 0)
      setProjectStartDate((prevStart) => {
        const newStart = new Date(prevStart);
        newStart.setDate(prevStart.getDate() + daysToAdd);
        return newStart;
      });

    if (increment > 0)
      setProjectEndDate((prevEnd) => {
        const newEnd = new Date(prevEnd);
        newEnd.setDate(prevEnd.getDate() + daysToAdd);
        return newEnd;
      });

    console.log('New Project Start Date:', projectStartDate);
    console.log('New Project End Date:', projectEndDate);
  };

  const initialFetch = async () => {
    try {
      const startAtFilter = {
        key: 'startAt',
        operation: 'GREATER_THAN_OR_EQUAL',
        value: projectStartDate.getTime().toString(),
        values: []
      };

      const endAtFilter = {
        key: 'endAt',
        operation: 'LESS_THAN_OR_EQUAL',
        value: projectEndDate.getTime().toString(),
        values: []
      };

      const currentFilters = filters || [];
      const taskData = {
        sortBy: 'position',
        sortDirectionAsc: true,
        filters: [...currentFilters, startAtFilter, endAtFilter]
      };

      const taskRes = await apiService.taskAPI.getPageByProject(project.id, taskData);
      if (taskRes?.data) {
        const combinedTasks = updateAndAddArray(tasks, taskRes.data.content);
        dispatch(setCurrentTaskList(combinedTasks));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const mappedTaskData = tasks.map((task) => ({
    TaskID: task.id,
    TaskName: task.name,
    StartDate: task.startAt ? new Date(task.startAt) : null,
    EndDate: task.endAt ? new Date(task.endAt) : null,
    Progress: task.progress || 0,
    subtasks: [],
  }));

  const taskFields = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    progress: 'Progress',
    child: 'subtasks',
  };

  const selectionSettings = {
    type: 'Multiple',
  };

  const splitterSettings = {
    columnIndex: 3,
  };

  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  };

  const labelSettings = {
    leftLabel: 'TaskName',
  };

  const getTimelineSettings = () => {
    switch (view) {
      case 'Day':
        return {
          timelineViewMode: 'Day',
          timelineUnitSize: 60,
          topTier: { unit: 'Day', format: 'MMM dd, yyyy' },
          bottomTier: { unit: 'Hour', count: 1, format: 'h:mm a' },
        };
      case 'Week':
        return {
          timelineViewMode: 'Week',
          topTier: { unit: 'Week', format: 'MMM dd, yyyy' },
          bottomTier: { unit: 'Day', count: 1, format: 'EEE' },
        };
      case 'Month':
        return {
          timelineViewMode: 'Month',
          topTier: { unit: 'Month', format: 'MMMM yyyy' },
          bottomTier: { unit: 'Week', count: 1, format: 'dd' },
        };
      default:
        return {};
    }
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: 120 }}>
          <InputLabel>View</InputLabel>
          <Select value={view} onChange={(e) => setView(e.target.value)} label="View">
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Week">Week</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
          </Select>
        </FormControl>

        <GanttComponent
          id="DragandDrop"
          dataSource={mappedTaskData}
          taskFields={taskFields}
          height={'100%'}
          treeColumnIndex={1}
          allowRowDragAndDrop={true}
          highlightWeekends={true}
          labelSettings={labelSettings}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
          allowTaskbarDragAndDrop={true}
          splitterSettings={splitterSettings}
          editSettings={editSettings}
          selectionSettings={selectionSettings}
          timelineSettings={getTimelineSettings()}
        >
          <ColumnsDirective>
            <ColumnDirective field="TaskID" headerText="ID" width="80" />
            <ColumnDirective field="TaskName" headerText="Name" width="250" />
            <ColumnDirective field="StartDate" headerText="Start Date" />
            <ColumnDirective field="EndDate" headerText="End Date" />
            <ColumnDirective field="Progress" headerText="Progress" />
          </ColumnsDirective>
          <Inject services={[Edit, RowDD, Selection]} />
        </GanttComponent>
      </div>
    </div>
  );
};

export default Gantt;
