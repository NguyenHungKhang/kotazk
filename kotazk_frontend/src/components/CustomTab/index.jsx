import React from 'react';
import { Box, Divider, IconButton, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddSectionDialog from './AddSectionDialog';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as TablerIcons from '@tabler/icons-react';
import { setSection, setSectionList } from '../../redux/actions/section.action';
import MenuSection from './MenuSection';
import ItemSection from './ItemSection';
import { useEffect } from 'react';
import { useState } from 'react';

export default function CustomTab() {
    const location = useLocation();
    const currentPath = location.pathname;
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [display, setDisplay] = useState(false);
    const sections = useSelector((state) => state.section.currentSectionList);
    const { sectionId } = useParams();
    const project = useSelector((state) => state.project.currentProject);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const pathname = window.location.pathname;

    useEffect(() => {
        if (currentPath.includes("workspace")) {
            setDisplay(false);
        } else if (workspace && currentPath.startsWith("/workspace/")) {
            setDisplay(true);
        } else if (project && workspace && currentPath.startsWith("/project/")) {
            setDisplay(true);
        } else {
            setDisplay(false);
        }
    }, [currentPath, project, workspace]);

    const handleNavigate = (section) => {
        navigate(`/project/${project?.id}/section/${section?.id}`);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedSections = Array.from(sections);
        const [movedSection] = reorderedSections.splice(result.source.index, 1);
        reorderedSections.splice(result.destination.index, 0, movedSection);

        dispatch(setSectionList(reorderedSections));
    };

    return sections == null ? (
        <Skeleton variant="rounded" width="100%" height="100%" />
    ) : (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            width={'100%'}
            display={display ? "flex" : "none"}
        >
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
                    <Droppable isDropDisabled={!currentMember?.role?.projectPermissions?.includes("MANAGE_SECTION")} droppableId="sections" direction="horizontal">
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
                                    to={`/project/${project?.id}`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        textDecoration: 'none',
                                        backgroundColor: sectionId == null && pathname == `/project/${project?.id}` ? theme.palette.primary.main : 'transparent',
                                        color: sectionId == null && pathname == `/project/${project?.id}` ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                        '&:hover': {
                                            backgroundColor: sectionId == null && pathname == `/project/${project?.id}`
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
                                        isDragDisabled={!currentMember?.role?.projectPermissions?.includes("MANAGE_SECTION")}
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
                                            >
                                                <ItemSection section={section} sectionId={sectionId} />
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
            {currentMember?.role?.projectPermissions?.includes("MANAGE_SECTION") && (
                <Box>
                    <AddSectionDialog />
                </Box>
            )}
        </Stack>
    );
}
