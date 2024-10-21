import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Collapse, IconButton, Box, Typography
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

// Dummy data
const tasksData = [
    {
        status: 'In Progress',
        tasks: [
            { id: 1, name: 'Fix bug #123', assignee: 'John', priority: 'High' },
            { id: 2, name: 'Build new feature', assignee: 'Alice', priority: 'Medium' },
        ]
    },
    {
        status: 'Completed',
        tasks: [
            { id: 3, name: 'Deploy to production', assignee: 'Michael', priority: 'Low' },
            { id: 4, name: 'Code review', assignee: 'Sarah', priority: 'Medium' },
        ]
    },
    {
        status: 'To Do',
        tasks: [
            { id: 5, name: 'Write documentation', assignee: 'David', priority: 'Low' },
            { id: 6, name: 'Prepare presentation', assignee: 'Eve', priority: 'High' },
        ]
    }
];

function Row({ statusGroup }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" colSpan={3}>
                    <Typography variant="h6">{statusGroup.status}</Typography>
                </TableCell>
            </TableRow>
            {open && statusGroup.tasks.map((task) => (
                <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                </TableRow>
            ))}
            {/* <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="tasks">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Task Name</TableCell>
                                        <TableCell>Assignee</TableCell>
                                        <TableCell>Priority</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {statusGroup.tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>{task.id}</TableCell>
                                            <TableCell>{task.name}</TableCell>
                                            <TableCell>{task.assignee}</TableCell>
                                            <TableCell>{task.priority}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow> */}
        </>
    );
}

export default function GroupedTable() {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">

                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Task Name</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>Priority</TableCell>
                </TableRow>
                <TableBody>
                    {tasksData.map((statusGroup) => (
                        <Row key={statusGroup.status} statusGroup={statusGroup} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
