import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode, getSortedRowModel } from '@tanstack/react-table';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Button, Card, Divider, Grid, Grid2, IconButton, Pagination, Skeleton, Stack, Tooltip, Typography, alpha, darken, lighten, useTheme } from '@mui/material';
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
import { setAddTaskDialog, setTaskDialog } from '../../redux/actions/dialog.action';
import CustomTaskDialog from '../../components/CustomTaskDialog';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { BorderColor } from '@mui/icons-material';
import { setCurrentGroupedTaskList } from '../../redux/actions/task.action';
import CustomPriorityPicker from '../../components/CustomPrirorityPicker';
import CustomAssigneePicker from '../../components/CustomAssigneePicker';
import CustomDueTimePicker from '../../components/CustomDueTimePicker';
import CustomLabelPicker from '../../components/CustomLabelPicker';
import CustomTimeEstimateTextField from '../../components/CustomTimeEstimateTextField';


const basicColumns = (theme) => [
    {
        accessorKey: 'name',
        header: 'Task Name',
        minSize: 300,
        size: 300,
        cell: ({ row }) => {
            const SubtaskIcon = TablerIcons["IconSubtask"];
            const AttachmentIcon = TablerIcons["IconPaperclip"];
            return (
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Box flexGrow={1}>
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
                    {row.original?.childTasks?.length > 0 && (
                        <Tooltip title={`${row.original?.childTasks?.length} subtask${row.original?.childTasks?.length > 1 ? 's' : ''}`} placement="top">
                            <Stack direction={'row'} spacing={0.5} p={0.5} bgcolor={getSecondBackgroundColor(theme)} borderRadius={1}>
                                <SubtaskIcon stroke={2} size={18} color={theme.palette.text.secondary} />
                                <Typography color={theme.palette.text.secondary}>
                                    {row.original?.childTasks?.filter(ct => ct.isCompleted == true)?.length}/{row.original?.childTasks?.length}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    )}

                    {row.original?.attachments?.length > 0 && (
                        <Tooltip title={`${row.original?.attachments?.length} attachment${row.original?.childTasks?.length > 1 ? 's' : ''}`} placement="top">
                            <Stack direction={'row'} spacing={0.5} p={0.5} bgcolor={getSecondBackgroundColor(theme)} borderRadius={1}>
                                <AttachmentIcon stroke={2} size={18} color={theme.palette.text.secondary} />
                                <Typography color={theme.palette.text.secondary}>
                                    {row.original?.attachments?.length}
                                </Typography>
                            </Stack>

                        </Tooltip>
                    )}
                </Stack>
            )
        }
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
        sortingFn: (rowA, rowB, columnId) => {
            const nameA = rowA.original.status?.name || '';
            const nameB = rowB.original.status?.name || '';

            return nameA.localeCompare(nameB);
        }
    },
    {
        accessorKey: 'taskType',
        header: 'Task Type',
        minSize: 150,
        size: 150,
        cell: ({ row }) => (
            <Box>
                <CustomTaskTypePicker currentTaskType={row.original.taskType} taskId={row.original.id} />
            </Box>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const nameA = rowA.original.taskType?.name || '';
            const nameB = rowB.original.taskType?.name || '';

            return nameA.localeCompare(nameB);
        }
    },
    {
        accessorKey: 'dueDate',
        header: 'Due date',
        minSize: 280,
        size: 280,
        cell: ({ row }) => (
            <Box>
                <CustomDueTimePicker startAt={row.original.startAt} endAt={row.original.endAt} taskId={row.original.id} />
            </Box>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const nameA = rowA.original.assignee?.name || '';
            const nameB = rowB.original.assignee?.name || '';

            return nameA.localeCompare(nameB);
        },
    },
    {
        accessorKey: 'timeEstimate',
        header: 'Time estimate',
        minSize: 150,
        size: 150,
        cell: ({ row }) => (
            <Box>
                <CustomTimeEstimateTextField currentTimeEstimate={row.original.timeEstimate} taskId={row.original.id} />
            </Box>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const nameA = rowA.original.assignee?.name || '';
            const nameB = rowB.original.assignee?.name || '';

            return nameA.localeCompare(nameB);
        },
    },
    {
        accessorKey: 'assignee',
        header: 'Assignee',
        minSize: 150,
        size: 150,
        cell: ({ row }) => (
            <Box>
                <CustomAssigneePicker currentAssignee={row.original.assignee} taskId={row.original.id} />
            </Box>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const nameA = rowA.original.assignee?.name || '';
            const nameB = rowB.original.assignee?.name || '';

            return nameA.localeCompare(nameB);
        }
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        minSize: 150,
        size: 150,
        cell: ({ row }) => (
            <Box>
                <CustomPriorityPicker currentPriority={row.original.priority} taskId={row.original.id} />
            </Box>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const nameA = rowA.original.priority?.name || '';
            const nameB = rowB.original.priority?.name || '';

            return nameA.localeCompare(nameB);
        }
    },
    {
        accessorKey: 'label',
        header: 'Label',
        minSize: 250,
        size: 250,
        cell: ({ row }) => (
            <Box
                sx={{
                    overflowX: 'auto'
                }}
            >
                <CustomLabelPicker currentLabelList={row.original.labels} taskId={row.original.id} />
            </Box>
        ),
    },
]

// TaskGrid Component for rendering a single grid
const TaskGrid = ({ tasks, columns, droppableId }) => {
    const theme = useTheme();
    const DragIcon = TablerIcons["IconGripVertical"]
    const AddFieldIcon = TablerIcons["IconCirclePlus"]
    const MoreIcon = TablerIcons["IconDots"]
    const DragHeaderIcon = TablerIcons["IconArrowsLeftRight"]
    const ExpandIcon = TablerIcons["IconArrowsMaximize"]
    const SortAscIcon = TablerIcons["IconSortAscending2"];
    const SortDescIcon = TablerIcons["IconSortDescending2"];
    const dispatch = useDispatch();
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        manualFiltering: true,
        onSortingChange: setSorting,
        state: {
            sorting,
        },
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
        <Box
            sx={{
                bgcolor: `${theme.palette.mode == 'light' ? 'white' : '#1e1e1e'}`
            }}
        >
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="task-grid"
                        style={{
                            maxWidth: '100%',
                            overflowX: 'auto'
                        }}
                    >
                        <Box
                            component="table"
                            sx={{
                                borderRadius: 2,
                                width: "100%",
                                tableLayout: 'fixed',
                                bgcolor: `${theme.palette.mode == 'light' ? 'white' : '#1e1e1e'}`,
                                '& td, th': {
                                    px: 1,
                                    borderRight: '1px solid',
                                    borderBottom: '1px solid',
                                    borderColor: `${theme.palette.mode == 'light' ? theme.palette.grey[200] : theme.palette.grey[800]} !important`,
                                    bgcolor: `${theme.palette.mode == 'light' ? 'white' : '#1e1e1e'}`,
                                },
                                "& th:hover, td:hover": {
                                    bgcolor: `${theme.palette.mode == 'light' ? darken('#fff', 0.05) : lighten('#1e1e1e', 0.05)} !important`
                                },
                                '& th': {
                                    py: '0 !important',
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
                                                p: 2
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
                                                <Stack direction={'row'} width={'100%'} alignItems={'center'}>
                                                    <Box flexGrow={1} m={2}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        <Typography textAlign={'left'} py={1}>
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                        </Typography>
                                                    </Box>

                                                    {{
                                                        asc: (<Box
                                                            bgcolor={getSecondBackgroundColor(theme)}
                                                            borderRadius={2}
                                                            p={1}
                                                            m={2}
                                                        >
                                                            <SortAscIcon size={16} />
                                                        </Box>),
                                                        desc: (<Box
                                                            bgcolor={getSecondBackgroundColor(theme)}
                                                            borderRadius={2}
                                                            p={1}
                                                            m={2}
                                                        >
                                                            <SortDescIcon size={16} />
                                                        </Box>),
                                                    }[header.column.getIsSorted()] ?? null}

                                                    <Box
                                                        {...{
                                                            onDoubleClick: (e) => {
                                                                e.stopPropagation(); // Prevents triggering parent onClick
                                                                header.column.resetSize();
                                                            },
                                                            onMouseDown: (e) => {
                                                                e.stopPropagation(); // Prevents triggering parent onClick
                                                                header.getResizeHandler()(e); // Ensure to call the resize handler with the event
                                                            },
                                                            onTouchStart: (e) => {
                                                                e.stopPropagation(); // Prevents triggering parent onClick
                                                                header.getResizeHandler()(e); // Ensure to call the resize handler with the event
                                                            },
                                                            className: `resizer ${table.options.columnResizeDirection} ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                                                        }}
                                                        sx={{
                                                            cursor: 'col-resize',
                                                            border: '4px solid',
                                                            alignSelf: 'stretch',
                                                            borderRadius: '4px',
                                                            borderColor: header.column.getIsResizing() ? theme.palette.primary.main : 'transparent',
                                                            transform: 'translateX(5px)',
                                                            "&:hover": {
                                                                borderColor: header.column.getIsResizing() ? theme.palette.primary.main : (theme.palette.mode == "light" ? theme.palette.grey[500] : theme.palette.grey[600]),
                                                            },
                                                            transition: 'border-color 0.2s'
                                                        }}
                                                    >
                                                        {''}
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ))}
                                        <th
                                            style={{
                                                width: 100,
                                                p: 2,
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
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </Box>
                                                ))}
                                                <td
                                                    style={{
                                                        width: 100,
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
        </Box>
    );
};

// Main Component for managing multiple grids
const ProjectList = () => {
    const theme = useTheme();
    const [openGroupByEntityDialog, setOpenGroupByEntityDialog] = useState(false);

    const [tasks, setTasks] = useState(null);
    // const [groupByEntity, setGroupByEntity] = useState("taskType");
    const groupByEntity = useSelector((state) => state.groupBy.currentGroupByEntity)
    const [groupByEntityList, setGroupByEntityList] = useState(null);
    // const [groupedTasks, setGroupedTasks] = useState(null);
    const groupedTasks = useSelector((state) => state.task.currentGroupedTaskList);
    const project = useSelector((state) => state.project.currentProject);
    const currentFilterList = useSelector((state) => state.filter.currentFilterList)
    const dispatch = useDispatch();

    useEffect(() => {
        if (project) {
            fetchGroupByEntityList();
        }
    }, [project, groupByEntity]);

    useEffect(() => {
        if (project) {
            fetchTasks();
        }
    }, [project, groupByEntity, currentFilterList]);

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
        const filterData = currentFilterList?.map(f => ({
            key: f.key,
            operation: f.operation,
            values: f.value,
        }));

        const data = {
            'sortBy': 'position',
            'sortDirectionAsc': true,
            'pageSize': 50,
            'filters': filterData || []
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
                                <GroupTask id={groupByEntityItem.id} name={groupByEntityItem.name} type={groupByEntity} projectId={project?.id} groupedTasks={groupedTasks?.find(gt => gt.id == groupByEntityItem.id)} />
                            </Grid2>
                        ))
                    }
                </Grid2>
            </DragDropContext>
            <CustomTaskDialog />
        </Box>
    );
};


const GroupTask = ({ id, name, type, projectId, groupedTasks }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [tasks, setTasks] = useState(null)
    const CollapseIcon = TablerIcons["IconChevronRight"];
    const OpenIcon = TablerIcons["IconChevronDown"];
    const ColorIcon = TablerIcons["IconSquareRoundedFilled"];
    const PlusTaskIcon = TablerIcons["IconPlus"];
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState();
    useEffect(() => {
        if (groupedTasks) {
            setTasks(groupedTasks?.items)
        }
    }, [groupedTasks])

    const columns = basicColumns(theme);

    const addTaskDialog = () => {
        dispatch(setAddTaskDialog({
            open: true,
            props: {
                groupBy: type,
                groupByEntity: groupedTasks
            }
        }))
    }

    return (tasks == null) ? <Skeleton variant='rounded' width={'100%'} height={'100%'} /> : (
        <Box
            width={'100%'}
            sx={{
                borderRadius: 2,
                p: 2,
                bgcolor: alpha((theme.palette.mode === "light" ? theme.palette.grey[300] : lighten(theme.palette.grey[900], 0.05)), 0.8)
            }}
        >
            <Card
                sx={{
                    p: 2,
                    width: '100%',
                    boxShadow: 0,
                    border: '1px solid',
                    borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800]
                }}
            >
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <IconButton size='small' onClick={() => setOpen(!open)}>
                        {open ? <OpenIcon size={16} /> : <CollapseIcon size={16} />}
                    </IconButton>
                    <ColorIcon size={12} color={groupedTasks?.customization?.backgroundColor} />
                    <Typography variant='body1'>{name}</Typography>
                </Stack>
            </Card>
            {open &&
                <Box mt={2}>
                    <Box
                        sx={{
                            overflowX: 'auto',
                            border: '1px solid',
                            borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800],
                            borderRadius: 2,
                            bgcolor: `${theme.palette.mode == 'light' ? 'white' : '#1e1e1e'}`
                        }}
                    >
                        <TaskGrid tasks={tasks} columns={columns} droppableId={id} />
                        <Button
                            onClick={() => addTaskDialog()}
                            size={'small'}
                            color={theme.palette.mode == "light" ? "customBlack" : "customWhite"}
                            startIcon={<PlusTaskIcon stroke={2} size={18} />}
                            fullWidth
                        >
                            Add task
                        </Button>
                    </Box>
                </Box>
            }

        </Box>
    );
}

export default ProjectList;
