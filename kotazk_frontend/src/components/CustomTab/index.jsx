import React from 'react';
import { Box, Divider, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddSectionDialog from './AddSectionDialog';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as TablerIcons from '@tabler/icons-react';
import { setSection, setSectionList } from '../../redux/actions/section.action';
import MenuSection from './MenuSection';

const ListIcon = TablerIcons["IconListDetails"];
const BoardIcon = TablerIcons["IconLayoutKanbanFilled"];
const CalendarIcon = TablerIcons["IconCalendarMonth"];
const FileIcon = TablerIcons["IconPaperclip"];
const ReportIcon = TablerIcons["IconChartInfographic"];

export default function CustomTab() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sections = useSelector((state) => state.section.currentSectionList);
    const { sectionId } = useParams();
    const project = useSelector((state) => state.project.currentProject);

    const handleNavigate = (section) => {
        navigate(`/project/${project?.id}/section/${section?.id}`);
    };

    const getIconBySectionType = (type) => {
        switch (type) {
            case "KANBAN":
                return <BoardIcon size={18} />;
            case "LIST":
                return <ListIcon size={18} />;
            case "CALENDAR":
                return <CalendarIcon size={18} />;
            case "FILE":
                return <FileIcon size={18} />;
            case "REPORT":
                return <ReportIcon size={18} />;
            default:
                return null;
        }
    };

    // Handles drag end event
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedSections = Array.from(sections);
        const [movedSection] = reorderedSections.splice(result.source.index, 1);
        reorderedSections.splice(result.destination.index, 0, movedSection);

        // Dispatch updated sections to the Redux store or state
        dispatch(setSectionList(reorderedSections));
    };

    return sections == null ? (
        <Skeleton variant="rounded" width="100%" height="100%" />
    ) : (
        <Stack direction="row" spacing={2} alignItems="center" width={'100%'}>
            <Box
                sx={{
                    minWidth: 0,
                    width: '100px',
                    overflowX: 'auto',
                    flexGrow: 1,
                    py: 2,
                    px: 0,
                    mx: 0,
                    '&::-webkit-scrollbar': {
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: theme.palette.grey[400],
                        borderRadius: '6px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: theme.palette.grey[600],
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${theme.palette.grey[400]} transparent`,
                }}
            >
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections" direction="horizontal">
                        {(provided) => (
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                width="100%"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <Box
                                    component={Link}
                                    to={`/project/${project?.id}/`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        textDecoration: 'none',
                                        backgroundColor: sectionId == null ? theme.palette.primary.main : 'transparent',
                                        color: sectionId == null ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                        '&:hover': {
                                            backgroundColor: sectionId == null
                                                ? theme.palette.primary.dark
                                                : theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    <HomeIcon />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textWrap: 'nowrap',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Dashboard
                                    </Typography>
                                </Box>
                                {sections.map((section, index) => (
                                    <Draggable
                                        key={section.id}
                                        draggableId={String(section.id)}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => handleNavigate(section)}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: 1,
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    backgroundColor: Number(sectionId) === section.id ? theme.palette.primary.main : 'transparent',
                                                    color: Number(sectionId) === section.id ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                                    '&:hover': {
                                                        backgroundColor: Number(sectionId) === section.id
                                                            ? theme.palette.primary.dark
                                                            : theme.palette.action.hover,
                                                    },
                                                }}
                                            >
                                                {getIconBySectionType(section.type)}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textWrap: 'nowrap',
                                                        textTransform: 'none',
                                                    }}
                                                >
                                                    {section.name}
                                                </Typography>
                                                {Number(sectionId) === section.id && (
                                                    <MenuSection section={section} />
                                                )}
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Stack>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
                <AddSectionDialog />
            </Box>
        </Stack>
    );
}
