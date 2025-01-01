import React from 'react';
import { TableBody, TableCell, TableRow, Typography } from '@mui/material';
import RoleRow from './RoleRow';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { useSelector } from 'react-redux';

const RoleTableBody = ({ permissions, roles, permissionsState, handleCheckboxChange, theme }) => {
    return (
        <TableBody>
            {permissions.map(({ group, items }) => (
                <React.Fragment key={group}>
                    <TableRow>
                        <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1, fontWeight: 'bold', backgroundColor: getSecondBackgroundColor(theme) }}>
                            {group}
                        </TableCell>
                        <TableCell colSpan={roles.length + 1} sx={{ backgroundColor: getSecondBackgroundColor(theme) }}></TableCell>
                    </TableRow>
                    {items.map(item => (
                        <RoleRow
                            key={item.key}
                            item={item}
                            roles={roles}
                            permissionsState={permissionsState}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                </React.Fragment>
            ))}
        </TableBody>
    );
};

export default RoleTableBody;
