import React from 'react';
import { Avatar, Box, Card, CardContent, Typography, Stack, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Star } from '@mui/icons-material';

const OverlayContent = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',  // Overlay full card
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    opacity: 0,  // Hidden by default
    transition: 'opacity 0.3s ease-in-out', // Smooth hover effect
    padding: '16px',
});

const StyledCard = styled(Card)({
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    '&:hover': {
        '& .overlay': {
            opacity: 1, // Show overlay on hover
        },
    },
});

const ProjectCard = ({ project, theme }) => {
    return (
        <StyledCard
            sx={{
                backgroundImage: `url(${project.imageUrl})`,
            }}
        >
            {/* Star icon at the top right */}
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#fff',
                }}
            >
                <Star />
            </IconButton>

            {/* Always visible project name */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                }}
            >
                <Typography variant="body1" fontWeight={650}>
                    {project.name}
                </Typography>
            </Box>

            {/* Overlay content - visible on hover */}
            <OverlayContent className="overlay">
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mt={2}
                >
                    <Avatar
                        sx={{
                            width: 25,
                            height: 25,
                            backgroundColor: '#fff',
                            color: theme.palette.primary.main,
                        }}
                    >
                        {project.owner.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" noWrap>
                        {project.owner}
                    </Typography>
                </Stack>

                {/* Other project details */}
                {/* <Typography
                    variant="body2"
                    mt={2}
                    noWrap
                >
                    Open tasks: {project.openTasks}
                </Typography>
                <Typography
                    variant="body2"
                    noWrap
                >
                    Done tasks: {project.doneTasks}
                </Typography> */}
            </OverlayContent>
        </StyledCard>
    );
};

export default ProjectCard;
