import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Chip, Avatar, alpha, useTheme } from '@mui/material';
import * as apiService from '../../api/index';

const columns = [
    { id: 'name', label: 'Name', minWidth: 30 },
    { id: 'description', label: 'Description', minWidth: 10 },
    { id: 'member', label: 'Member', minWidth: 50 },
    { id: 'status', label: 'Status', minWidth: 10 },
    { id: 'visibility', label: 'Visibility', minWidth: 10 },
    // Add new column for member
];

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const theme = useTheme();
    const { workspaceId } = useParams();
    const [projectListResponse, setProjectListResponse] = useState();


    useEffect(() => {
        const initialFetch = async () => {
            const data = {
                filters: []
            };
            console.log(workspaceId);
            await apiService.projectAPI.pageByWorkspace(workspaceId, data)
                .then(res => { console.log(res); setProjectListResponse(res.data); })
                .catch(err => console.warn(err));
        };

        if (workspaceId != null) initialFetch();
    }, [workspaceId]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectListResponse?.content
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'visibility' ? (
                                                        <Chip
                                                            label={value.toLowerCase()}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: value === 'PUBLIC' ? alpha(theme.palette.warning.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                                                                color: value === 'PUBLIC' ? theme.palette.warning.main : theme.palette.error.main,
                                                                textTransform: 'capitalize',
                                                            }}
                                                        />
                                                    ) : column.id === 'member' ? (
                                                        // Display Avatar for member
                                                        <Avatar sx={{height: 30, width: 30}} alt={value?.user?.lastName}>{value?.user?.lastName.charAt(0)}</Avatar>
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={projectListResponse?.content.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
