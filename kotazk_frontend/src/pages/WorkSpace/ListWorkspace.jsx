// ListProject.js
import React, { useState } from 'react';
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import CustomProjectCard from '../../components/CustomProjectCard';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import * as apiService from '../../api/index'
import CustomSaveProjectDialog from '../../components/CustomSaveProjectDialog';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentProjectList } from '../../redux/actions/project.action';

const ListProject = () => {
    const theme = useTheme();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const projectList = useSelector((state) => state.project.currentProjectList);
    const dispatch = useDispatch();

    useEffect(() => {
        if (workspace != null)
            initialFetch();
    }, [, workspace]);


    const initialFetch = async () => {
        const data = {
            "filters": []
        }
        await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
            .then(res => { console.log(res); dispatch(setCurrentProjectList(res.data)); })
            .catch(err => console.warn(err))
    }


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
                {projectList?.content?.map((project) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={12 / 5} key={project.id}>
                        <CustomProjectCard project={project} theme={theme} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ListProject;
