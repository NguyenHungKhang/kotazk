// ListProject.js
import React from 'react';
import { Box, Grid, Typography, useTheme } from "@mui/material";
import CustomProjectCard from '../../components/CustomProjectCard';

export const dummyData = [
    {
        id: 1,
        name: 'Project Alpha',
        owner: 'Nguyen Hung Khang',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF9W9vwDNn5X7zAVeDHXgUKo0nBy0pqCaDcw&s',
        openTasks: 5,
        doneTasks: 2,
    },
    {
        id: 2,
        name: 'Project Beta',
        owner: 'Jane Doe',
        imageUrl: 'https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?cs=srgb&dl=pexels-fotios-photos-1107717.jpg&fm=jpg',
        openTasks: 3,
        doneTasks: 4,
    },
    {
        id: 3,
        name: 'Project Gamma',
        owner: 'John Smith',
        imageUrl: 'https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_640.png',
        openTasks: 7,
        doneTasks: 1,
    },
    {
        id: 4,
        name: 'Project Delta',
        owner: 'Alice Johnson',
        imageUrl: 'https://img.freepik.com/free-photo/beautiful-natural-view-landscape_23-2150787996.jpg',
        openTasks: 2,
        doneTasks: 6,
    },
    {
        id: 5,
        name: 'Project Epsilon',
        owner: 'Chris Lee',
        imageUrl: 'https://via.placeholder.com/400x200?text=Project+Epsilon',
        openTasks: 4,
        doneTasks: 5,
    }
];

const ListProject = () => {
    const theme = useTheme();

    return (
        <Box>
            <Typography
                variant="h6"
                fontWeight={650}
                my={2}
            >
                List of projects
            </Typography>
            <Grid container spacing={2}>
                {dummyData.map((project) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={project.id}>
                        <CustomProjectCard project={project} theme={theme} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ListProject;
