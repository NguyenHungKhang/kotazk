import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnResizeMode } from '@tanstack/react-table';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Box, Button, Card, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';
import * as TablerIcons from '@tabler/icons-react'

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
        size: 200, // Set initial width
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        size: 100, // Set initial width
    },
];

// TaskGrid Component for rendering a single grid
const TaskGrid = ({ tasks, columns, droppableId }) => {
    const theme = useTheme();
    const DragIcon = TablerIcons["IconGripVertical"]
    const AddFieldIcon = TablerIcons["IconCirclePlus"]
    const MoreIcon = TablerIcons["IconDots"]
    const PlusTaskIcon = TablerIcons["IconPlus"]
    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        // onColumnSizingChange: setColumnSizing,
    });

    return (
        <>
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="task-grid"
                    >
                        <table
                            style={{
                                width: "100%"
                            }}
                        >
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        <th
                                            style={{
                                                width: 50,
                                                borderBottom: '1px solid'
                                            }}
                                        />
                                        {headerGroup.headers.map(header => (
                                            <th
                                                {...{
                                                    key: header.id,
                                                    colSpan: header.colSpan,
                                                    style: {
                                                        width: header.getSize(),
                                                        borderBottom: '1px solid'
                                                    },
                                                }}
                                            >
                                                <Stack direction={'row'} width={'100%'}>
                                                    <Box flexGrow={1}>
                                                        <Typography color={theme.palette.text.secondary} textAlign={'left'}>
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                        </Typography>
                                                    </Box>
                                                    <Divider
                                                        {...{
                                                            onDoubleClick: () => header.column.resetSize(),
                                                            onMouseDown: header.getResizeHandler(),
                                                            onTouchStart: header.getResizeHandler(),
                                                            className: `resizer ${table.options.columnResizeDirection
                                                                } ${header.column.getIsResizing() ? 'isResizing' : ''
                                                                }`,
                                                        }}
                                                        orientation="vertical" flexItem
                                                        sx={{
                                                            borderWidth: 2
                                                        }}
                                                    />
                                                </Stack>
                                            </th>
                                        ))}
                                        <th
                                            style={{
                                                // width: header.getSize(),
                                                borderBottom: '1px solid',
                                                paddingLeft: 8
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
                                                        width: 50,
                                                        borderBottom: '1px solid'
                                                    }}
                                                    {...provided.dragHandleProps}>

                                                    <DragIcon size={16} stroke={2} />
                                                </td>
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id}
                                                        style={{
                                                            borderBottom: '1px solid'
                                                        }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                                <td
                                                    style={{
                                                        // width: header.getSize(),
                                                        borderBottom: '1px solid',
                                                        paddingLeft: 8
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
                        </table>
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
        <Card
            sx={{
                p: 4,
                height: '100%'
            }}
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h6'>To Do</Typography>
                        <TaskGrid tasks={tasks.todo} columns={columns} droppableId="todo" />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h6'>In Progress</Typography>
                        <TaskGrid tasks={tasks.inProgress} columns={columns} droppableId="inProgress" />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h6'>Done</Typography>
                        <TaskGrid tasks={tasks.done} columns={columns} droppableId="done" />
                    </Grid>
                </Grid>
            </DragDropContext>
        </Card>
    );
};

export default ProjectList;
