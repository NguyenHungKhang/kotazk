import React, { useEffect, useRef, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, getSortedRowModel } from '@tanstack/react-table';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Button, Card, Divider, Grid, Grid2, IconButton, Pagination, Skeleton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
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
import { setCurrentGroupedTaskList } from '../../redux/actions/task.action';

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
        size: 150,
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
                        className="task-grid"
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
                                    left: 60,
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
                                    <Draggable key={String(row.original.id)} draggableId={String(row.original.id)} index={index}>

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
    const [tasks, setTasks] = useState(null);
    // const [groupByEntity, setGroupByEntity] = useState("taskType");
    const groupByEntity = useSelector((state) => state.groupBy.currentGroupByEntity)
    const [groupByEntityList, setGroupByEntityList] = useState(null);
    // const [groupedTasks, setGroupedTasks] = useState(null);
    const groupedTasks = useSelector((state) => state.task.currentGroupedTaskList);
    const project = useSelector((state) => state.project.currentProject);
    const dispatch = useDispatch();

    useEffect(() => {
        if (project) {
            fetchGroupByEntityList();
            fetchTasks();
        }
    }, [project, groupByEntity]);

    useEffect(() => {
        if (tasks && groupByEntityList) {
            groupTasks();
        }
    }, [tasks, groupByEntityList]);




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

    const fetchTasks = async () => {
        const data = {
            'sortBy': 'position',
            'sortDirectionAsc': true,
            'filters': []
        }

        const taskListResponse = await apiService.taskAPI.getPageByProject(project.id, data)

        if (taskListResponse?.data) {
            setTasks(taskListResponse?.data?.content)
        }
    }


    const groupTasks = () => {
        const grouped = groupByEntityList.reduce((acc, entity) => {
            const key = entity.id; // Assuming entity.id matches task's groupByEntity value
            const items = tasks?.filter(task => task[groupByEntity]?.id == key);
            acc.push({
                ...entity,
                items: items || [],
                droppableId: String(entity.id)
            });
            return acc;
        }, []);
        dispatch(setCurrentGroupedTaskList(
            {
                list: grouped,
                groupedEntity: groupByEntity
            }
        ));
    };

    const handleSaveDnD = async (dstGroupId, currentItemId, nextItemId, previousItemId) => {
        const rePositionReq = (nextItemId || previousItemId) ? {
            currentItemId,
            nextItemId,
            previousItemId
        } : null;

        const groupMappings = {
            status: "statusId",
            taskType: "taskTypeId",
            priority: "priority"
        };
        const groupField = groupMappings[groupByEntity];
        const groupValue = dstGroupId || null;

        if (!groupValue && !rePositionReq) return null;

        const data = {
            [groupField]: groupValue,
            rePositionReq
        };

        try {
            const response = await apiService.taskAPI.update(currentItemId, data);
            if (response?.data) {
                return response?.data
            }
        } catch (error) {
            console.error("Failed to update task:", error);
            return null;
        }
    };

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        // Exit if dropped outside the list or no movement
        if (!destination) return;

        const sourceGroupIndex = groupedTasks.findIndex(group => String(group.id) === String(source.droppableId));
        const destinationGroupIndex = groupedTasks.findIndex(group => String(group.id) === String(destination.droppableId));

        if (sourceGroupIndex === -1 || destinationGroupIndex === -1 ||
            (sourceGroupIndex === destinationGroupIndex && source.index === destination.index)) {
            return;
        }

        // Optimistically update the UI
        const sourceItems = Array.from(groupedTasks[sourceGroupIndex].items);
        const destinationItems = sourceGroupIndex === destinationGroupIndex
            ? sourceItems
            : Array.from(groupedTasks[destinationGroupIndex].items);

        const [movedTask] = sourceItems.splice(source.index, 1);
        destinationItems.splice(destination.index, 0, movedTask);

        dispatch(setCurrentGroupedTaskList({
            list: (prevGroupedTasks => {
                const updatedGroups = [...prevGroupedTasks];
                updatedGroups[sourceGroupIndex] = {
                    ...updatedGroups[sourceGroupIndex],
                    items: sourceItems
                };
                if (sourceGroupIndex !== destinationGroupIndex) {
                    updatedGroups[destinationGroupIndex] = {
                        ...updatedGroups[destinationGroupIndex],
                        items: destinationItems
                    };
                }
                return updatedGroups;
            })(groupedTasks),
            groupedEntity: groupByEntity
        }));

        const dstGroupId = destination?.droppableId !== source?.droppableId ? destination?.droppableId : null;
        const currentItemId = movedTask?.id;
        const nextItemId = destination.index - 1 >= 0 ? destinationItems[destination.index - 1]?.id : null;
        const previousItemId = destination.index + 1 < destinationItems.length ? destinationItems[destination.index + 1]?.id : null;

        const response = await handleSaveDnD(dstGroupId, currentItemId, nextItemId, previousItemId);

        if (response) {
            dispatch(setCurrentGroupedTaskList({
                list: (prevGroupedTasks => {
                    const newDestinationItems = destinationItems.map(item =>
                        item.id === response?.id ? response : item
                    );

                    const updatedGroups = [...prevGroupedTasks];
                    updatedGroups[sourceGroupIndex] = { ...updatedGroups[sourceGroupIndex], items: sourceItems };
                    if (sourceGroupIndex !== destinationGroupIndex) {
                        updatedGroups[destinationGroupIndex] = {
                            ...updatedGroups[destinationGroupIndex],
                            items: newDestinationItems
                        };
                    }
                    return updatedGroups;
                })(groupedTasks),
                groupedEntity: groupByEntity
            }));
        }
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
                    {
                        groupedTasks != null &&
                        groupByEntityList?.map((groupByEntityItem) => (
                            <Grid2 key={groupByEntity.id} item size={12}>
                                <GroupTask id={groupByEntityItem.id} name={groupByEntityItem.name} type={groupByEntity} projectId={project?.id} groupedTasks={groupedTasks?.find(gt => gt.id == groupByEntityItem.id)?.items} />
                            </Grid2>
                        ))
                    }
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


const GroupTask = ({ id, name, type, projectId, groupedTasks }) => {
    const [open, setOpen] = useState(true);
    const [tasks, setTasks] = useState(null)
    const CollapseIcon = TablerIcons["IconChevronRight"];
    const OpenIcon = TablerIcons["IconChevronDown"];
    const [pagination, setPagination] = useState();
    useEffect(() => {
        if (groupedTasks)
            setTasks(groupedTasks)
    }, [groupedTasks])

    // const fetchTaskList = async () => {
    //     const filters = {
    //         'filters': [
    //             {
    //                 key: `${type}.id`,
    //                 operation: "EQUAL",
    //                 value: id,
    //                 values: []
    //             }
    //         ]
    //     }
    //     const taskListResponse = await apiService.taskAPI.getPageByProject(projectId, filters)
    //     if (taskListResponse?.data)
    //         setTasks(taskListResponse?.data.content)
    // }
    return (tasks == null) ? <Skeleton variant='rounded' width={'100%'} height={'100%'} /> : (
        <Card
            sx={{
                p: 2,
                width: '100%',
                boxShadow: 0
            }}
        >
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <IconButton size='small' onClick={() => setOpen(!open)}>
                    {open ? <OpenIcon size={16} /> : <CollapseIcon size={16} />}
                </IconButton>
                <Typography variant='body1'>{name}</Typography>
            </Stack>
            {open &&
                <Box mt={2}>
                    <Box
                        sx={{
                            overflowX: 'auto'
                        }}
                    // overflow={'auto'}
                    // width={'5000px'}
                    >
                        <TaskGrid tasks={tasks} columns={columns} droppableId={id} />
                    </Box>
                    <Stack justifyContent={'center'} direction={'row'} width={'100%'} mt={1}>
                        <Pagination size='small' count={10} variant="outlined" shape="rounded" />
                    </Stack>
                </Box>
            }

        </Card>
    );
}

export default ProjectList;
