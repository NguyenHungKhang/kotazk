// ListProject.js
import React, { useState } from 'react';
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import CustomProjectCard from '../../components/CustomProjectCard';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import * as apiService from '../../api/index'
import CustomSaveProjectDialog from '../../components/CustomSaveProjectDialog';

const ListProject = () => {
    const theme = useTheme();
    const { workspaceId } = useParams();
    const [projectListResponse, setProjectListResponse] = useState();

    useEffect(() => {
        const initialFetch = async () => {
            const data = {
                "filters": []
            }
            console.log(workspaceId)
            await apiService.projectAPI.pageByWorkspace(workspaceId, data)
                .then(res => { console.log(res); setProjectListResponse(res.data); })
                .catch(err => console.warn(err))
        }

        if (workspaceId != null)
            initialFetch();
    }, [, workspaceId]);
    return (
        <Box>
            <Stack direction='row' spacing={2} alignItems='center'>
                <Box flexGrow={1}>
                    <Typography
                        variant="h6"
                        fontWeight={650}
                        my={2}
                    >
                        List of projects
                    </Typography>
                </Box>
                <Box>
                    <CustomSaveProjectDialog />
                </Box>
            </Stack>
            <Grid container spacing={4}>
                {projectListResponse?.content?.map((project) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={12 / 5} key={project.id}>
                        <CustomProjectCard project={project} theme={theme} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ListProject;
