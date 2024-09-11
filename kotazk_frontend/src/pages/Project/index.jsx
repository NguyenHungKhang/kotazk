import { Box, Card, Divider, Stack, Typography, useTheme } from "@mui/material";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import CustomHeader from "../../components/CustomHeader";
import SideBar from "../../components/SideBar";
import CustomTab from "../../components/CustomTab";
import CustomFilterBar from "../../components/CustomFilterBar";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import * as apiService from '../../api/index'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../../redux/actions/project.action";

const Project = ({ children }) => {
    const theme = useTheme();
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    useEffect(() => {
        if (projectId != null)
            fetchInitial();
    }, [, projectId])

    const fetchInitial = async () => {
        await apiService.projectAPI.getById(projectId)
            .then(res => dispatch(setCurrentProject(res.data)))
            .catch(err => console.log(err));
    }

    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1 p-7">
                <Stack
                    height='calc(100vh - 2*1.75rem);'
                    display="flex"
                    flexDirection="column"
                >
                    <Box flex=' 0 1 auto'>
                        <CustomHeader />
                        <CustomBreadcrumb />
                        <Stack direction='row' mt={2}>
                            <Box flexGrow={1}>
                                <CustomTab />
                            </Box>
                            <Box>
                                <CustomFilterBar />
                            </Box>
                        </Stack>
                        <Divider
                            sx={{
                                my: 2
                            }}
                        />
                    </Box>
                    <Box
                        flex=' 1 1 auto'
                        sx={{
                            backgroundImage: 'url("https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6_3x2.jpg")',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            p: 4,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        {children}
                    </Box>
                </Stack>
            </div>
        </div>
    );
}

export default Project;
