import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, IconButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import * as allIcons from "@tabler/icons-react"
import { useDispatch } from 'react-redux';
import { setDeleteDialog } from '../../redux/actions/dialog.action';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import { setCurrentTaskList } from '../../redux/actions/task.action';
import { updateAndAddArray } from '../../utils/arrayUtil';

export default function SubtaskMenu({ parentTask, task }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const MoreIcon = allIcons["IconDots"];
    const DeleteIcon = allIcons["IconTrashXFilled"];
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleOpenDeleteDialog = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete task "${task?.name}"?`,
            content:
                `You're about to permanently delete this task, its comments and attachments, and all of its data.
                <br/><br/>
                If you're not sure, you can resolve or close this task instead.`,
            open: true,
            deleteType: "DELETE_SUBTASK",
            deleteProps: {
                taskId: task?.id,
                parentTask: parentTask
            }
            // deleteAction: () => handleDelete(),
        }));
        setAnchorEl(null);
    };

    return (
        <div>
            <Box>
                <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreIcon stroke={2} size={16} />
                </IconButton>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleOpenDeleteDialog}>
                    <ListItemIcon>
                        <DeleteIcon size={16} stroke={2} color={theme.palette.error.main} />
                    </ListItemIcon>
                    <ListItemText>

                        <Typography color={theme.palette.error.main} fontWeight={500}>
                            Delete task
                        </Typography>
                    </ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}
