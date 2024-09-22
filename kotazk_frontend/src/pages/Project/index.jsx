import { Box, Card, Divider, Stack, Typography, lighten, useTheme } from "@mui/material";
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
import { setCurrentStatusList } from "../../redux/actions/status.action";
import { setCurrentTaskTypeList } from "../../redux/actions/taskType.action";
import { setCurrentPriorityList } from "../../redux/actions/priority.action";

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
        try {
            const res = await apiService.projectAPI.getDetailsById(projectId);
            const {
                statuses,
                labels, // Fixed typo from "lables"
                priorities,
                members,
                sections,
                taskTypes,
                memberRoles,
                ...projectBasicInfoRes
            } = res.data;
    
            dispatch(setCurrentProject(projectBasicInfoRes));
            dispatch(setCurrentStatusList(statuses));
            dispatch(setCurrentTaskTypeList(taskTypes));
            dispatch(setCurrentPriorityList(priorities));
        } catch (err) {
            console.error('Error fetching project details:', err);
        }
    };
    

    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1">
                <Stack
                    height='100vh'
                    display="flex"
                    flexDirection="column"
                    spacing={1}
                >
                    <Box
                        flex=' 0 1 auto'
                        px={4}
                        pt={4}
                        boxShadow={4}
                        pb={2}
                    >
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

                    </Box>
                    <Box
                        flexGrow={1}
                        sx={{
                            '--dot-bg': theme.palette.background.default,
                            '--dot-color':  theme.palette.mode === "light" ?  theme.palette.text.secondary : theme.palette.grey[700],
                            '--dot-size': '1px',
                            '--dot-space': '10px',
                            background: `
                              linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
                              linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
                              var(--dot-color)
                            `,
                            p: 4,
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
