import * as React from 'react';
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
} from '@mui/material';

const projectNewData = [
    {
        TaskID: 1,
        TaskName: 'Project Initiation',
        StartDate: new Date('03/25/2024'),
        EndDate: new Date('03/27/2024'),
        Progress: 70,
        subtasks: [
            { TaskID: 2, TaskName: 'Identify Site Location', StartDate: new Date('03/25/2024'), Duration: 2, Progress: 30 },
            { TaskID: 3, TaskName: 'Perform Soil Test', StartDate: new Date('03/26/2024'), Duration: 1, Progress: 40 },
            { TaskID: 4, TaskName: 'Soil Test Approval', StartDate: new Date('03/27/2024'), Duration: 1, Progress: 50 }
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Project Planning',
        StartDate: new Date('03/28/2024'),
        EndDate: new Date('04/10/2024'),
        Progress: 60,
        subtasks: [
            { TaskID: 6, TaskName: 'Develop Floor Plan', StartDate: new Date('03/28/2024'), Duration: 3, Progress: 40 },
            { TaskID: 7, TaskName: 'Allocate Resources', StartDate: new Date('03/31/2024'), Duration: 2, Progress: 50 },
            { TaskID: 8, TaskName: 'Project Approval', StartDate: new Date('04/02/2024'), Duration: 1, Progress: 60 }
        ]
    },
    {
        TaskID: 9,
        TaskName: 'Project Execution',
        StartDate: new Date('04/11/2024'),
        EndDate: new Date('04/30/2024'),
        Progress: 80,
        subtasks: [
            { TaskID: 10, TaskName: 'Foundation Work', StartDate: new Date('04/11/2024'), Duration: 5, Progress: 70 },
            { TaskID: 11, TaskName: 'Framing', StartDate: new Date('04/16/2024'), Duration: 3, Progress: 80 },
            { TaskID: 12, TaskName: 'Plumbing', StartDate: new Date('04/19/2024'), Duration: 4, Progress: 90 },
            { TaskID: 13, TaskName: 'Electrical', StartDate: new Date('04/23/2024'), Duration: 3, Progress: 85 },
            { TaskID: 14, TaskName: 'Roofing', StartDate: new Date('04/26/2024'), Duration: 2, Progress: 80 }
        ]
    },
    {
        TaskID: 15,
        TaskName: 'Project Closure',
        StartDate: new Date('05/01/2024'),
        EndDate: new Date('05/05/2024'),
        Progress: 90,
        subtasks: [
            { TaskID: 16, TaskName: 'Final Inspection', StartDate: new Date('05/01/2024'), Duration: 1, Progress: 90 },
            { TaskID: 17, TaskName: 'Project Handover', StartDate: new Date('05/03/2024'), Duration: 2, Progress: 95 }
        ]
    }
];

const TestGantt = () => {
    const ganttRef = React.useRef(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

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
            setOpenDialog(false); // Close the dialog after jumping to the selected date
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Handle toolbar actions
    const handleToolbarClick = (args) => {
        if (args.item.text === 'Add') {
            alert('Add button clicked!');
        }
    };

    // Handle taskbar double-click event
    const handleTaskbarDoubleClick = () => {
        // const taskName = args.data.TaskName;
        alert(`Task double-clicked:`);
    };

    const handleAddTask = () => {
        alert('Add Task button clicked!');
    };

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

    const handleLinkCreate = (args) => {
        alert("123");
        const { data } = args;
        if (data.length) {
            data.forEach(link => {
                const { fromTaskId, toTaskId } = link;
                // Handle the linked tasks as needed
                alert(`Task linked: From Task ID ${fromTaskId} to Task ID ${toTaskId}`);
            });
        }
    };

    return (
        <div>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" onClick={handlePrevTimeSpan}>
                    Previous Time Span
                </Button>
                <Button variant="contained" onClick={handleNextTimeSpan}>
                    Next Time Span
                </Button>
                <Button variant="contained" onClick={handleZoomIn}>
                    Zoom In
                </Button>
                <Button variant="contained" onClick={handleZoomOut}>
                    Zoom Out
                </Button>
                <Button variant="contained" onClick={handleZoomToFit}>
                    Zoom To Fit
                </Button>
                <Button variant="contained" onClick={handleJumpToToday}>
                    Jump to Today
                </Button>
                <Button variant="contained" onClick={handleOpenDialog}>
                    Jump to Date
                </Button>
                {/* Add Task Button */}
                <Button variant="contained" onClick={handleAddTask}>
                    Add Task
                </Button>
            </Stack>

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

            <GanttComponent
                id="DragandDrop"
                ref={ganttRef}
                dataSource={projectNewData}
                taskFields={taskFields}
                height="100%"
                treeColumnIndex={1}
                allowRowDragAndDrop={true}
                highlightWeekends={true}
                labelSettings={labelSettings}
                enableImmutableMode={true}
                allowTaskbarDragAndDrop={true}
                splitterSettings={splitterSettings}
                editSettings={editSettings}
                selectionSettings={selectionSettings}
                toolbar={toolbarOptions}
                toolbarClick={handleToolbarClick} // Trigger alert on Add click
                onTaskbarClick={() => handleTaskbarDoubleClick()} // Trigger alert on double-click
                actionComplete={(args) => handleActionCompelete(args)}
            >
                <ColumnsDirective>
                    <ColumnDirective field="TaskID" headerText="ID" width="80"></ColumnDirective>
                    <ColumnDirective
                        field="TaskName"
                        headerText="Name"
                        width="250"
                    ></ColumnDirective>
                    <ColumnDirective field="StartDate"></ColumnDirective>
                    <ColumnDirective field="EndDate"></ColumnDirective>
                    <ColumnDirective field="Duration"></ColumnDirective>
                    <ColumnDirective field="Progress"></ColumnDirective>
                    <ColumnDirective
                        field="Predecessor"
                        headerText="Dependency"
                    ></ColumnDirective>
                </ColumnsDirective>
                <Inject services={[Edit, RowDD, Toolbar, Selection]} />
            </GanttComponent>
        </div>
    );
};

export default TestGantt;
