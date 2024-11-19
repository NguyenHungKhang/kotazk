import * as React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import { Box, Button, Menu, Stack, Typography, alpha, styled, useTheme } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { useDispatch } from 'react-redux';
import { setCurrentGroupByEntity } from '../../redux/actions/groupBy.action';
import { useSelector } from 'react-redux';
import * as TablerIcons from '@tabler/icons-react'
import { getCustomTwoModeColor } from '../../utils/themeUtil';

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

export default function CustomGroupedByDialog() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const selectedItem = useSelector((state) => state.groupBy.currentGroupByEntity);
    const section = useSelector((state) => state.section.currentSection);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();

    const AddIcon = TablerIcons["IconPlus"];
    const DeleteIcon = TablerIcons["IconTrashXFilled"];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (item) => {
        dispatch(setCurrentGroupByEntity({
            currentGroupByEntity: item,
            isSystemEntity: true,
        }
        ))
        handleClose();
    };

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{
                    textTransform: 'none',
                    width: 'fit-content'
                }}
                color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                size="small"
                // variant='outlined'
                startIcon={<LayersIcon fontSize="small" />}
            >
                <Stack direction='row' spacing={1} alignItems={'center'}>
                    <Box>
                        Group By
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={18}
                        bgcolor={getCustomTwoModeColor(theme, "#000", "#fff")}
                        px={1}
                        borderRadius={1}
                    >
                        <Typography variant='body2' color={getCustomTwoModeColor(theme, "#fff", "#000")}>
                            {groupByMenu.find(i => i.id == selectedItem)?.label}
                        </Typography>
                    </Box>
                </Stack>
            </Button>


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
                    <MenuItem onClick={() => handleSelect('status')}>
                        <ListItemIcon>
                            {selectedItem === 'status' && <Check />}
                        </ListItemIcon>
                        <ListItemText inset>Status</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleSelect('taskType')}>
                        <ListItemIcon>
                            {selectedItem === 'taskType' && <Check />}
                        </ListItemIcon>
                        <ListItemText inset>Task type</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleSelect('priority')}>
                        <ListItemIcon>
                            {selectedItem === 'priority' && <Check />}
                        </ListItemIcon>
                        <ListItemText inset>Priority</ListItemText>
                    </MenuItem>
                    <Divider />
                    {section?.type === "LIST" &&
                        <MenuItem onClick={() => handleSelect('Clear')}>
                            <Stack direction={'row'} spacing={2}>
                                <DeleteIcon size={18} color={theme.palette.error.main} />
                                <Typography variant='body1' color='error'>Clear</Typography>
                            </Stack>

                        </MenuItem>
                    }

                    <MenuItem onClick={() => handleSelect('Add single select custom field')}>
                        <Stack direction={'row'} spacing={2}>
                            <AddIcon size={18} />
                            <Typography variant='body1'>Add single select custom field</Typography>
                        </Stack>
                    </MenuItem>
                </MenuList>
            </StyledMenu>
        </>
    );
}
