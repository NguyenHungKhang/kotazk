import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, getSortedRowModel } from '@tanstack/react-table';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Button, Card, Divider, Grid, Grid2, IconButton, Pagination, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import * as TablerIcons from '@tabler/icons-react'
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import CustomStatus from '../../components/CustomStatus';
import CustomTaskType from '../../components/CustomTaskType';
import CustomPriority from '../../components/CustomPriority';
import CustomStatusPicker from '../../components/CustomStatusPicker';
import CustomTaskTypePicker from '../../components/CustomTaskTypePicker';
import CustomBasicTextField from '../../components/CustomBasicTextField';
import { useDispatch } from 'react-redux';
import { setTaskDialog } from '../../redux/actions/dialog.action';
import CustomTaskDialog from '../../components/CustomTaskDialog';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { BorderColor } from '@mui/icons-material';

// Define task data and columns in the same file
const initialTaskData = {
    todo: [
        { id: '1', name: 'Task 1', priority: 'High' },
        { id: '2', name: 'Task 2', priority: 'Medium' },
    ],
    inProgress: [
        { id: '3', name: 'Task 3', priority: 'Low' },
    ],
    done: [
        { id: '4', name: 'Task 4', priority: 'High' },
    ],
};

const columns = [
    {
        accessorKey: 'name',
        header: 'Task Name',
        size: 250,
        cell: ({ row }) => (
            <Box>
                <CustomBasicTextField
                    fullWidth
                    size='small'
                    defaultValue={row.original.name}
                    InputProps={{
                        sx: {
                            // fontSize: 12,
                            // p: 2
                        }
                    }}
                />
            </Box >
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        size: 150, // Set initial width
        cell: ({ row }) => (
            <Box>
                <CustomStatusPicker currentStatus={row.original.status} taskId={row.original.id} />
            </Box>
        ),
    },
    {
        accessorKey: 'taskType',
        header: 'Task Type',
        size: 150,
        cell: ({ row }) => (
            <Box>
                <CustomTaskTypePicker currentTaskType={row.original.taskType} taskId={row.original.id} />
            </Box>
        ),
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        size: 150,
        cell: ({ row }) => (
            <Box>
                {row?.original?.priority ? <CustomPriority priority={row.original.priority} /> : 'Empty'}
            </Box>
        ),
    },
];

// TaskGrid Component for rendering a single grid
const TaskGrid = ({ tasks, columns, droppableId }) => {
    const theme = useTheme();
    const DragIcon = TablerIcons["IconGripVertical"]
    const AddFieldIcon = TablerIcons["IconCirclePlus"]
    const MoreIcon = TablerIcons["IconDots"]
    const PlusTaskIcon = TablerIcons["IconPlus"]
    const DragHeaderIcon = TablerIcons["IconArrowsLeftRight"]
    const ExpandIcon = TablerIcons["IconArrowsMaximize"]
    const dispatch = useDispatch();

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        // onColumnSizingChange: setColumnSizing,
    });

    const expandRow = (row) => {
        const taskDialogData = {
            task: row,
            open: true
        }
        dispatch(setTaskDialog(taskDialogData));
    }

    return (
        <>
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // className="task-grid"
                        style={{
                            // maxWidth: '100%' ,
                            overflowX: 'auto'
                        }}
                    >
                        <Box
                            component="table"
                            sx={{
                                width: "100%",
                                tableLayout: 'fixed',
                                '& td, th': {
                                    p: 1,
                                    border: '1px solid',
                                    borderColor: `${theme.palette.mode == 'light' ? theme.palette.grey[200] : theme.palette.grey[800]} !important`
                                },
                                '& td': {
                                    bgcolor: `${theme.palette.mode == 'light' ? 'white' : '#1e1e1e'} !important`
                                },
                                '& th': {
                                    p: 2,
                                    bgcolor: getSecondBackgroundColor(theme),
                                    opacity: 1
                                },
                                '& td:first-child, th:first-child, td:nth-child(2), th:nth-child(2)': {
                                    position: 'sticky',
                                    zIndex: 1
                                },
                                '& td:first-child, th:first-child': {
                                    left: 0
                                },

                                '& td:nth-child(2), th:nth-child(2)': {
                                    left:60,
                                }

                            }}
                        >
                            <thead
                            >
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        <Box

                                            component={'th'}
                                            sx={{
                                                width: 60,
                                                borderRightWidth: '0 !important',
                                            }}
                                        />
                                        {headerGroup.headers.map(header => (
                                            <Box
                                                component={'th'}
                                                {...{
                                                    key: header.id,
                                                    colSpan: header.colSpan,
                                                    style: {
                                                        width: header.getSize(),
                                                    },
                                                }}
                                            >
                                                <Stack direction={'row'} width={'100%'}>
                                                    <Box flexGrow={1}>
                                                        <Typography textAlign={'left'}>
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        {...{
                                                            onDoubleClick: () => header.column.resetSize(),
                                                            onMouseDown: header.getResizeHandler(),
                                                            onTouchStart: header.getResizeHandler(),
                                                            className: `resizer ${table.options.columnResizeDirection
                                                                } ${header.column.getIsResizing() ? 'isResizing' : ''
                                                                }`,
                                                        }}
                                                        sx={{
                                                            ml: 2,
                                                            cursor: 'col-resize',
                                                        }}
                                                    >
                                                        <DragHeaderIcon size={16} />
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ))}
                                        <th
                                            style={{
                                                width: 100,
                                                borderBottom: '1px solid',
                                                paddingLeft: 8,
                                            }}
                                        >
                                            <AddFieldIcon stroke={2} size={16} />
                                        </th>
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row, index) => (
                                    <Draggable key={row.original.id} draggableId={row.original.id} index={index}>
                                        {(provided) => (
                                            <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <td
                                                    style={{
                                                        width: 60,
                                                        borderRightWidth: '0px !important',
                                                    }}
                                                >
                                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                                        <Box {...provided.dragHandleProps}>
                                                            <DragIcon size={16} stroke={2} />
                                                        </Box>
                                                        <IconButton
                                                            size='small'
                                                            onClick={() => expandRow(row.original)}
                                                        >
                                                            <ExpandIcon size={16} stroke={2} />
                                                        </IconButton>

                                                    </Stack>

                                                </td>
                                                {row.getVisibleCells().map(cell => (
                                                    <Box
                                                        component={'td'}
                                                        key={cell.id}
                                                        sx={{
                                                            borderBottom: '1px solid',
                                                            borderRight: '1px solid'
                                                        }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </Box>
                                                ))}
                                                <td
                                                    style={{
                                                        width: 100,
                                                        borderBottom: '1px solid',
                                                        paddingLeft: 8,
                                                    }}
                                                >

                                                    <MoreIcon size={16} stroke={2} />
                                                </td>
                                            </tr>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </tbody>
                        </Box>
                    </div>
                )}
            </Droppable>
            <Button
                size={'small'}
                color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}
                startIcon={<PlusTaskIcon stroke={2} size={18} />}
            >
                Add task
            </Button>
        </>
    );
};

// Main Component for managing multiple grids
const ProjectList = () => {
    const [tasks, setTasks] = useState(initialTaskData);
    const [groupByEntity, setGroupByEntity] = useState("taskType");
    const [groupByEntityList, setGroupByEntityList] = useState(null);
    const project = useSelector((state) => state.project.currentProject)

    useEffect(() => {
        if (project != null)
            fetchGroupByEntityList();
    }, [project, groupByEntity])

    const fetchGroupByEntityList = async () => {
        const data = {
            'sortBy': 'position',
            'sortDirectionAsc': true,
            'filters': []
        }
        let groupByEntityListResponse = null;
        if (groupByEntity == 'status') groupByEntityListResponse = await apiService.statusAPI.getPageByProject(project.id, data)
        else if (groupByEntity == 'taskType') groupByEntityListResponse = await apiService.taskTypeAPI.getPageByProject(project.id, data)
        else if (groupByEntity == 'priority') groupByEntityListResponse = await apiService.priorityAPI.getPageByProject(project.id, data)

        if (groupByEntityListResponse?.data)
            setGroupByEntityList(groupByEntityListResponse?.data.content)
    }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Drop outside the grid
        if (!destination) return;

        const sourceGrid = source.droppableId;
        const destinationGrid = destination.droppableId;

        // If the task was dropped in the same grid
        if (sourceGrid === destinationGrid) return;

        // Find the task being dragged
        const taskToMove = tasks[sourceGrid][source.index];

        // Update state
        setTasks((prev) => {
            const sourceTasks = Array.from(prev[sourceGrid]);
            const destinationTasks = Array.from(prev[destinationGrid]);

            // Remove task from the source grid
            sourceTasks.splice(source.index, 1);
            // Add task to the destination grid
            destinationTasks.splice(destination.index, 0, taskToMove);

            return {
                ...prev,
                [sourceGrid]: sourceTasks,
                [destinationGrid]: destinationTasks,
            };
        });
    };

    return (
        <Box
            sx={{
                height: '100%',
                overflow: 'auto'
            }}
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid2 container spacing={2}>
                    {groupByEntityList?.map((groupByEntityItem) => (
                        <Grid2 key={groupByEntity.id} item size={12}>
                            <GroupTask id={groupByEntityItem.id} name={groupByEntityItem.name} type={groupByEntity} projectId={project?.id} />
                        </Grid2>
                    ))}

                    {/* <Grid2 item size={12}>
                        <GroupTask name={"In Progress"} tasks={tasks.inProgress} />
                    </Grid2>
                    <Grid2 item size={12}>
                        <GroupTask name={"Done"} tasks={tasks.done} />

                    </Grid2> */}
                </Grid2>
            </DragDropContext>
            <CustomTaskDialog />
        </Box>
    );
};


const GroupTask = ({ id, name, type, projectId }) => {
    const [open, setOpen] = useState(true);
    const [tasks, setTasks] = useState(null)
    const CollapseIcon = TablerIcons["IconChevronRight"];
    const OpenIcon = TablerIcons["IconChevronDown"];
    const [pagination, setPagination] = useState();
    useEffect(() => {
        if (id && type && projectId)
            fetchTaskList()
    }, [id, type, projectId])

    const fetchTaskList = async () => {
        const filters = {
            'filters': [
                {
                    key: `${type}.id`,
                    operation: "EQUAL",
                    value: id,
                    values: []
                }
            ]
        }
        const taskListResponse = await apiService.taskAPI.getPageByProject(projectId, filters)
        if (taskListResponse?.data)
            setTasks(taskListResponse?.data.content)
    }
    return (tasks == null) ? <Skeleton variant='rounded' width={'100%'} height={'100%'} /> : (
        <Card
            sx={{
                p: 2,
                width: '100%'
            }}
        >
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <IconButton size='small' onClick={() => setOpen(!open)}>
                    {open ? <OpenIcon size={16} /> : <CollapseIcon size={16} />}
                </IconButton>
                <Typography variant='body1'>{name}</Typography>
            </Stack>
            {open &&
                <Box>
                    <Box
                        sx={{
                            overflowX: 'auto'
                        }}
                    // overflow={'auto'}
                    // width={'5000px'}
                    >
                        <TaskGrid tasks={tasks} columns={columns} droppableId="todo" />
                    </Box>
                    <Stack justifyContent={'center'} direction={'row'} width={'100%'} mt={2}>
                        <Pagination size='small' count={10} variant="outlined" shape="rounded" />
                    </Stack>
                </Box>
            }

        </Card>
    );
}

export default ProjectList;
