import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { Button, Stack, Typography } from '@mui/material';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1.5),
        border: 0,
        borderRadius: 20,
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
        },

        '&:first-of-type': {
            marginLeft: theme.spacing(0.5),
        },
        '&:last-of-type': {
            marginRight: theme.spacing(0.5),
        },
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]: {
        marginLeft: -1,
        borderLeft: '1px solid transparent',
    },
}));

export default function TestGroupButtonMenu() {
    const [alignment, setAlignment] = React.useState('left');
    const maxChars = 60; // Số ký tự tối đa
    const buttons = [
        { value: 'kanban', label: 'Kanban', icon: <ViewKanbanIcon fontSize='small' /> },
        { value: 'list', label: 'List', icon: <ListAltIcon fontSize='small' /> },
        { value: 'calendar', label: 'Calendar', icon: <CalendarMonthIcon fontSize='small' /> },
        { value: 'gantt', label: 'Gantt', icon: <ViewTimelineIcon fontSize='small' /> },
        { value: 'board', label: 'Board View', icon: <ViewKanbanIcon fontSize='small' /> },
        { value: 'timeline', label: 'Timeline', icon: <ViewTimelineIcon fontSize='small' /> },
        { value: 'overview', label: 'Overview', icon: <ViewTimelineIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
        { value: 'progress', label: 'Progress', icon: <ListAltIcon fontSize='small' /> },
    ];

    let totalChars = 0;
    let visibleButtons = [];
    let remainingButtons = [];

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        totalChars += button.label.length;

        if (totalChars <= maxChars) {
            visibleButtons.push(button);
        } else {
            remainingButtons = buttons.slice(i);
            break;
        }
    }

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <Stack direction='row' alignItems='center' spacing={4}>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                    width: 'fit-content',
                    borderRadius: 5,
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                >
                    {visibleButtons.map(button => (
                        <ToggleButton
                            key={button.value}
                            value={button.value}
                            aria-label={button.label}
                            size='small'
                            textTransform='none'
                        >
                            <Typography variant='body2' sx={{ textTransform: 'none' }}>
                                {button.icon} {" "} {button.label}
                            </Typography>
                            {/* <Stack direction='row' spacing={2} alignItems='center'>
                                {button.icon}
                                <Typography  sx={{ textTransform: 'none' }}>
                                    {button.label}
                                </Typography>
                            </Stack> */}
                        </ToggleButton>
                    ))}
                    {remainingButtons.length > 0 && (
                        <ToggleButton value="mor" aria-label="more" size='small'>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Typography variant='body2' sx={{ textTransform: 'none' }}>
                                    {remainingButtons.length} more...
                                </Typography>
                            </Stack>
                        </ToggleButton>
                    )}
                </StyledToggleButtonGroup>
            </Paper>
            <Button
                sx={{
                    textTransform: 'none',
                    borderRadius: 8,
                }}
                startIcon={<ViewKanbanIcon />}
                variant='contained'
                size='small'
            >
                Add Section
            </Button>
        </Stack>
    );
}
