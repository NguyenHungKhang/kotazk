import React, { useState } from 'react';
import { Box, Card, Checkbox, Grid2, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { projectPermissionList } from './projectPermissonList';
import { getSecondBackgroundColor } from '../../utils/themeUtil';

const roles = ['Guest', 'Editor', 'Admin', 'Admin 2', 'Admin 3', 'Admin 4', 'Admin 5', 'Admin 6', 'Admin 7', 'Admin 8', 'Admin 9', 'Admin 10', 'Admin 11', 'Admin 12'];
const permissions = projectPermissionList;

const ProjectRole = () => {
    const theme = useTheme();
    const [permissionsState, setPermissionsState] = useState(
        roles.reduce((acc, role) => {
            acc[role] = {};
            permissions.forEach(({ items }) =>
                items.forEach(item => (acc[role][item.key] = false))
            );
            return acc;
        }, {})
    );

    const handleCheckboxChange = (role, key) => {
        setPermissionsState(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [key]: !prev[role][key]
            }
        }));
    };

    return (
        <Stack direction={'row'} spacing={2}
            sx={{
                height: '100%',
            }}
        >
            {/* <Card
                sx={{
                    width: 300,
                    p: 2
                }}
            >
                <Typography textAlign={'center'} fontWeight={650} my={2}>
                    Role lists
                </Typography>
                <Stack spacing={1} justifyContent={'center'}>
                    {roles.map(role => (
                        <Box
                            p={2}
                            borderRadius={2}
                            bgcolor={getSecondBackgroundColor(theme)}
                            key={role}
                        >
                            {role}
                        </Box>
                    ))}
                </Stack>
            </Card> */}
            <Card
                sx={{
                    height: '100%',
                    // width: 2000,
                    overflowY: 'hidden',
                    // bgcolor: theme.palette.background.default,
                    p: 2,
                }}
            >
                <TableContainer maxHeight={'100%'} component={Box}>
                    <Table stickyHeader size="small"
                        sx={{
                            tableLayout: "fixed"
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        width: 600,
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 3,
                                    }}
                                >
                                    Permission
                                </TableCell>
                                {roles.map(role => (
                                    <TableCell
                                        key={role}
                                        sx={{
                                            width: 200,
                                        }}
                                    >
                                        {role}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permissions.map(({ group, items }) => (
                                <React.Fragment key={group}>
                                    <TableRow>
                                        <TableCell style={{ position: 'sticky', left: 0, zIndex: 1, fontWeight: 'bold', backgroundColor: getSecondBackgroundColor(theme) }}>
                                            {group}
                                        </TableCell>
                                        <TableCell colSpan={roles.length} style={{ backgroundColor: getSecondBackgroundColor(theme) }}>

                                        </TableCell>
                                    </TableRow>
                                    {items.map(({ key, title, description }) => (
                                        <TableRow key={key}>
                                            <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1, bgcolor: theme.palette.mode == "light" ? "#fff" : "#1e1e1e" }}>
                                                <Typography fontWeight={650}>
                                                    {title}
                                                </Typography>
                                                <Typography>
                                                    {description}
                                                </Typography>
                                            </TableCell>
                                            {roles.map(role => (
                                                <TableCell key={`${role}-${key}`}>
                                                    <Checkbox
                                                        checked={permissionsState[role][key]}
                                                        onChange={() => handleCheckboxChange(role, key)}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card >
        </Stack>
    );
};

export default ProjectRole;
