import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  GanttComponent,
  Inject,
  Selection,
  ColumnsDirective,
  ColumnDirective,
  RowDD,
  Toolbar,
  Edit,
} from '@syncfusion/ej2-react-gantt';
import {
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import * as apiService from '../../api/index'; // Assuming you have an apiService for making API calls
import { updateAndAddArray } from '../../utils/arrayUtil';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import CustomTaskDialog from '../../components/CustomTaskDialog';
import * as TablerIcons from '@tabler/icons-react'
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { styled } from 'styled-components';

const DarkModeGantt = styled.div`
  /* Root */
  .e-gantt {
    background-color: #2e2e2e;
    color: #ffffff;
  }

  /* Header */
  .e-gridheader {
    background-color: #333333;
    border-bottom: 1px solid #444444;
  }

  .e-columnheader,
  .e-table {
    background-color: #333333;
    color: #ffffff;
  }

  /* Grid Content */
  .e-gridcontent {
    background-color: #2e2e2e;
  }

  .e-row,
  .e-altrow {
    background-color: #3e3e3e;
    color: #ffffff;
  }

  .e-altrow {
    background-color: #454545;
  }

  .e-rowcell {
    color: #ffffff;
  }

  /* Chart Content */
  .e-gantt-chart {
    background-color: #2e2e2e;
  }

  .e-chart-row {
    background-color: #3e3e3e;
  }

  /* Timeline */
  .e-timeline-header-container {
    background-color: #3a3a3a;
    color: #ffffff;
  }

  .e-header-cell-label {
    color: #ffffff;
  }

  .e-weekend-header-cell {
    background-color: #4a4a4a;
  }

  /* Taskbar */
  .e-taskbar-main-container {
    background-color: #4e4e4e;
  }

  .e-gantt-parent-taskbar,
  .e-gantt-child-manualtaskbar {
    background-color: #6d6d6d;
    border-color: #757575;
  }

  .e-gantt-milestone {
    background-color: #ff9800;
  }

  .e-gantt-unscheduled-taskbar,
  .e-gantt-manualparenttaskbar,
  .e-gantt-unscheduled-manualtask {
    background-color: #7d7d7d;
  }

  /* Splitter */
  .e-split-bar {
    background-color: #555555;
  }

  .e-resize-handler {
    background-color: #666666;
  }

  .e-arrow-left,
  .e-arrow-right {
    color: #ffffff;
  }

  /* Connector Lines */
  .e-line {
    stroke: #ffffff;
  }

  .e-connector-line-right-arrow,
  .e-connector-line-left-arrow {
    color: #ffffff;
  }

  /* Labels */
  .e-task-label,
  .e-right-label-container,
  .e-left-label-container {
    color: #ffffff;
  }

  /* Event Markers */
  .e-event-markers {
    background-color: #ff5722;
  }

  /* Baseline */
  .e-baseline-bar,
  .e-baseline-gantt-milestone-container {
    background-color: #ffffff;
  }

  /* Tooltip */
  .e-gantt-tooltip {
    background-color: #444444;
    color: #ffffff;
  }
`;


const TestGantt = () => {
  const theme = useTheme();
  const ganttRef = React.useRef(null);
  const project = useSelector((state) => state.project.currentProject)
  const filters = useSelector((state) => state.filter.currentFilterList)
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [ganttFormatTasks, setGanttFormatTasks] = useState([]);

  const PreviousTimeSpanIcon = TablerIcons["IconChevronLeft"];
  const NextTimeSpanIcon = TablerIcons["IconChevronRight"];
  const ZoomInIcon = TablerIcons["IconZoomIn"];
  const ZoomOutIcon = TablerIcons["IconZoomOut"];
  const ZoomToFitIcon = TablerIcons["IconZoomPanFilled"];

  useEffect(() => {
    if (project != null) {
      initialFetch();
    }
  }, [project, filters]);

  const initialFetch = async () => {
    try {
      const currentFilters = filters || [];
      const taskData = {
        sortBy: 'position',
        sortDirectionAsc: true,
        filters: [...currentFilters],
      };

      const taskRes = await apiService.taskAPI.getPageByProject(project.id, taskData);
      if (taskRes?.data) {
        console.log(taskRes)
        const combinedTasks = updateAndAddArray(tasks, taskRes?.data?.content);
        setTasks(combinedTasks);
        const ganttTasks = taskRes?.data?.content?.map(mapTaskToGanttFormat);
        const combinedGanttTasks = updateAndAddArray(ganttFormatTasks, ganttTasks);
        setGanttFormatTasks(combinedGanttTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const openTaskDialog = (currentTask) => {
    const taskDialogData = {
      task: currentTask,
      open: true
    }
    dispatch(setTaskDialog(taskDialogData));
  }

  const mapTaskToGanttFormat = (apiTask) => {
    if (!apiTask) return null;

    return {
      TaskID: apiTask.id,                       // API 'id' mapped to 'TaskID'
      TaskName: apiTask.name,                   // API 'name' mapped to 'TaskName'
      StartDate: apiTask.startAt ? new Date(apiTask.startAt) : null,  // API 'start_date' mapped to 'StartDate'
      EndDate: apiTask.endAt ? new Date(apiTask.endAt) : null,      // API 'end_date' mapped to 'EndDate'
      // Duration: 1,
      // Progress: 90,
      // Predecessor: null,
      // subtasks: [],
      // Add more mappings if needed
    };
  };

  // Functions for handling Gantt component
  const handleNextTimeSpan = () => {
    ganttRef.current.nextTimeSpan();
  };

  const handlePrevTimeSpan = () => {
    ganttRef.current.previousTimeSpan();
  };

  const handleZoomIn = () => {
    ganttRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    ganttRef.current.zoomOut();
  };

  const handleZoomToFit = () => {
    ganttRef.current.fitToProject();
  };

  const handleJumpToToday = () => {
    const today = new Date();
    ganttRef.current.scrollToDate(today);
  };

  const handleJumpToSelectedDate = () => {
    if (selectedDate) {
      ganttRef.current.scrollToDate(new Date(selectedDate));
      setOpenDialog(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTaskbarDoubleClick = (args) => {
    const taskId = args?.data?.TaskID;
    const currentTask = tasks.find(t => t.id === taskId);

    if (currentTask) {
      openTaskDialog(currentTask);
    }
  };


  const handleActionCompelete = (args) => {
    console.log(args)
    if (args.requestType == "indent" || args.requestType == "outdent" || args.requestType == "recordUpdate" || args.requestType === 'save' || args.action === "DrawConnectorLine") {
      var ganttRec = [];
      if (args.requestType == "save" || args.action === "DrawConnectorLine")
        ganttRec.push(args.modifiedRecords);
      else
        ganttRec.push(args.data);
      if (args.updatedRecords && args.updatedRecords.length)
        ganttRec = ganttRec.concat(args.updatedRecords);
      alert(ganttRec);
    }
  }


  const taskFields = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    child: 'subtasks',
  };

  const selectionSettings = {
    type: 'Multiple',
  };

  const splitterSettings = {
    columnIndex: 3,
  };

  const editSettings = {
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  };

  const labelSettings = {
    taskLabel: 'TaskName',
  };

  const toolbarOptions = [
    'Add',
    'Edit',
    'Delete',
    'Cancel',
    'Update',
    'ExpandAll',
    'CollapseAll',
    'Search',
  ];

  return (
    <>
      <Box bgcolor={getSecondBackgroundColor(theme)} p={2} mb={2}>
        <Stack direction="row" spacing={2}>
          <IconButton size='small' onClick={handlePrevTimeSpan}>
            <PreviousTimeSpanIcon />
          </IconButton>
          <IconButton size='small' onClick={handleNextTimeSpan}>
            <NextTimeSpanIcon />
          </IconButton>
          <IconButton size='small' onClick={handleZoomIn}>
            <ZoomInIcon />
          </IconButton>
          <IconButton size='small' onClick={handleZoomOut}>
            <ZoomOutIcon />
          </IconButton>
          <IconButton size='small' onClick={handleZoomToFit}>
            <ZoomToFitIcon />
          </IconButton>
          {/* <Button variant="contained" onClick={handleJumpToToday}>
          Jump to Today
        </Button>
        <Button variant="contained" onClick={handleOpenDialog}>
          Jump to Date
        </Button> */}
        </Stack>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Jump to Date</DialogTitle>
        <DialogContent>
          <TextField
            id="date"
            label="Select Date"
            type="date"
            value={selectedDate.toISOString().split('T')[0]} // Format date to YYYY-MM-DD
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJumpToToday}>Jump to Today</Button>
          <Button onClick={handleJumpToSelectedDate}>Jump to Selected Date</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Box height="100%">
        {/* <DarkModeGantt> */}
          <GanttComponent
            id="DragandDrop"
            ref={ganttRef}
            dataSource={ganttFormatTasks} // Use dynamic tasks
            taskFields={taskFields}
            height={"100%"}
            treeColumnIndex={1}
            allowRowDragAndDrop={true}
            highlightWeekends={true}
            allowUnscheduledTasks={true}
            labelSettings={labelSettings}
            enableImmutableMode={true}
            allowTaskbarDragAndDrop={true}
            splitterSettings={splitterSettings}
            editSettings={editSettings}
            selectionSettings={selectionSettings}
            toolbar={toolbarOptions}
            onTaskbarClick={(args) => handleTaskbarDoubleClick(args)} // Trigger alert on double-click
            actionComplete={(args) => handleActionCompelete(args)}
            allowResizing={true}
            gridLines='Both'
          >
            <ColumnsDirective>
              <ColumnDirective field="TaskID" headerText="ID" hideAtMedia={true}></ColumnDirective>
              <ColumnDirective field="TaskName" headerText="Name" width="250"></ColumnDirective>
              <ColumnDirective field="StartDate" hideAtMedia={true}></ColumnDirective>
              <ColumnDirective field="EndDate" hideAtMedia={true}></ColumnDirective>
              {/* <ColumnDirective field="Duration"></ColumnDirective> */}
              {/* <ColumnDirective field="Progress"></ColumnDirective> */}
              <ColumnDirective field="Predecessor" headerText="Dependency" hideAtMedia={true}></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Edit, RowDD, Selection]} />
          </GanttComponent>
        {/* </DarkModeGantt> */}
      </Box>
      <CustomTaskDialog />
    </>
  );
};

export default TestGantt;
