import * as React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import { Box, Button, IconButton, Menu, Stack, Typography, alpha, styled, useTheme } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { useDispatch } from 'react-redux';
import { setCurrentGroupByEntity } from '../../redux/actions/groupBy.action';
import { useSelector } from 'react-redux';
import * as TablerIcons from '@tabler/icons-react'
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import { setDeleteDialog } from '../../redux/actions/dialog.action';

const groupByMenu = [
    { id: "status", label: "Status" },
    { id: "taskType", label: "Task type" },
    { id: "priority", label: "Priority" },
]

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));

export default function CommentItemDialog({ setEditing, commentId }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const selectedItem = useSelector((state) => state.groupBy.currentGroupByEntity);
    const section = useSelector((state) => state.section.currentSection);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();

    const MoreIcon = TablerIcons["IconDots"];
    const EditIcon = TablerIcons["IconPencil"];
    const DeleteIcon = TablerIcons["IconTrashXFilled"];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectEdit = () => {
        setEditing(true);
        handleClose();
    };

    const handleSelectDelete = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete this comment?`,
            content:
                `You're about to permanently delete this comment.`,
            open: true,
            deleteType: "DELETE_TASK_COMMENT",
            deleteProps: {
                taskCommentId: commentId
            }
        }));
        handleClose();
    };

    return (
        <>    <IconButton size="small"
            sx={{
                bgcolor: theme.palette.background.default
            }}
            onClick={handleClick}
        >
            <MoreIcon size={18} />
        </IconButton>


            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ width: 320 }}
            >
                <MenuList
                    sx={{
                        '& .MuiListItemText-inset': {
                            pl: "0 !important"
                        }
                    }}
                    dense>
                    <MenuItem onClick={() => handleSelectEdit()}>
                        <Stack direction={'row'} spacing={2}>
                            <EditIcon size={18} />
                            <Typography variant='body1'>Edit</Typography>
                        </Stack>
                    </MenuItem>

                    <MenuItem onClick={(e) => handleSelectDelete(e)}>
                        <Stack direction={'row'} spacing={2}>
                            <DeleteIcon size={18} color={theme.palette.error.main} />
                            <Typography variant='body1' color='error'>Delete</Typography>
                        </Stack>

                    </MenuItem>
                </MenuList>
            </StyledMenu>
        </>
    );
}
