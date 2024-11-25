import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as TablerIcons from '@tabler/icons-react'
import { IconButton, Stack, TextField, Typography, useTheme } from '@mui/material';
import CustomBasicTextField from '../CustomBasicTextField';
import { useSelector } from 'react-redux';
import * as apiService from '../../api/index'
import { useDispatch } from 'react-redux';
import { setSectionList } from '../../redux/actions/section.action';
import { setDeleteDialog } from '../../redux/actions/dialog.action';

const ListIcon = TablerIcons["IconListDetails"];
const BoardIcon = TablerIcons["IconLayoutKanbanFilled"];
const CalendarIcon = TablerIcons["IconCalendarMonth"];
const TimelineIcon = TablerIcons["IconTimelineEvent"];
const FileIcon = TablerIcons["IconPaperclip"];
const ReportIcon = TablerIcons["IconChartInfographic"];

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

export default function MenuSection({section}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const theme = useTheme();
    const open = Boolean(anchorEl);
    const project = useSelector((state) => state.project.currentProject)
    const dispatch = useDispatch();

    const ArchiveIcon = TablerIcons["IconArchiveFilled"];
    const DeleteIcon = TablerIcons["IconTrashXFilled"];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDeleteDialog = (event) => {
        dispatch(setDeleteDialog({
            title: `Delete section "${section?.name}"?`,
            content:
                `You're about to permanently delete this section`,
            open: true,
            deleteType: "DELETE_SECTION",
            deleteProps: {
                sectionId: section?.id
            }
        }));
    };

    return (
        <div>


            <IconButton
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                size="small"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                color="customWhite"
                sx={{
                    p: "0",
                    // fontSize:
                    // color: "#fff"
                }}
            >
                <MoreHorizIcon stroke={2} fontSize={"small"} />
            </IconButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleClose} disableRipple>
                    <Stack direction={'row'} spacing={2}>
                        <ArchiveIcon size={18} />
                        <Typography>Edit</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={() => handleOpenDeleteDialog()} disableRipple>
                    <Stack direction={'row'} spacing={2}>
                        <DeleteIcon size={18} color={theme.palette.error.main} />
                        <Typography color={theme.palette.error.main}>Delete</Typography>
                    </Stack>
                </MenuItem>
            </StyledMenu>


        </div>
    );
}
