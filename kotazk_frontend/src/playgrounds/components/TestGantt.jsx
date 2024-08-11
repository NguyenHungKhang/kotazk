import * as React from 'react';
import { useEffect } from 'react';
import { GanttComponent, Inject, Edit, Selection, ColumnsDirective, ColumnDirective, RowDD } from '@syncfusion/ej2-react-gantt';
// import { projectNewData } from './data';

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


const DragAndDrop = () => {
    const taskFields = {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks'
    };
    const selectionSettings = {
        type: 'Multiple'
    };
    const splitterSettings = {
        columnIndex: 3
    };
    const editSettings = {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    };
    const projectStartDate = new Date('03/25/2024');
    const projectEndDate = new Date('07/06/2024');
    const labelSettings = {
        leftLabel: 'TaskName'
    };
    return (<div className='control-pane'>
      <div className='control-section'>
        <GanttComponent id='DragandDrop' dataSource={projectNewData} taskFields={taskFields} height='410px' treeColumnIndex={1} allowRowDragAndDrop={true} highlightWeekends={true} labelSettings={labelSettings} projectStartDate={projectStartDate} projectEndDate={projectEndDate} allowTaskbarDragAndDrop={true} splitterSettings={splitterSettings} editSettings={editSettings} selectionSettings={selectionSettings}>
          <ColumnsDirective>
            <ColumnDirective field='TaskID' headerText='ID' width='80'></ColumnDirective>
            <ColumnDirective field='TaskName' headerText='Name' width='250'></ColumnDirective>
            <ColumnDirective field='StartDate'></ColumnDirective>
            <ColumnDirective field='EndDate'></ColumnDirective>
            <ColumnDirective field='Duration'></ColumnDirective>
            <ColumnDirective field='Progress'></ColumnDirective>
            <ColumnDirective field='Predecessor' headerText='Dependency'></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Edit, RowDD, Selection]}/>
        </GanttComponent>
      </div>
    </div>);
};
export default DragAndDrop;
