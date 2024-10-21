import { Box, Card, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
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
import { setCurrentLabelList } from "../../redux/actions/label.action";
import { setCurrentProjectMemberList } from "../../redux/actions/member.action";
import CustomAddTaskDialog from "../../components/CustomAddTaskDialog";
import { setCurrentWorkspace } from "../../redux/actions/workspace.action";

const Project = ({ children }) => {
    const theme = useTheme();
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [open, setOpen] = useState(true);
    const breadcrumbData = [
        {
            "label": workspace?.name,
            "href": `/workspace/${workspace?.id}`
        },
        {
            "label": project?.name,
        }
    ]
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
                workSpace,
                ...projectBasicInfoRes
            } = res.data;

            dispatch(setCurrentProject(projectBasicInfoRes));
            dispatch(setCurrentStatusList(statuses));
            dispatch(setCurrentTaskTypeList(taskTypes));
            dispatch(setCurrentPriorityList(priorities));
            dispatch(setCurrentLabelList(labels));
            dispatch(setCurrentProjectMemberList(members));
            dispatch(setCurrentWorkspace(workSpace));
        } catch (err) {
            console.error('Error fetching project details:', err);
        }
    };


    return (
        <Box p={4}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
                // backgroundImage: `url('https://i.pinimg.com/736x/d1/de/5e/d1de5ede98e95b2a8cc7e71a84f506a2.jpg')`,
                // backgroundImage: `url('https://i.pinimg.com/564x/b0/94/c5/b094c5ceba9148e06fca396ac12367d6.jpg')`,
                background: theme.palette.mode == "light" ? "#EFEFEF" : "#121212",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Stack direction='row' spacing={4} alignItems="stretch" height={"calc(100% - 32px)"}>
                <SideBar open={open} setOpen={setOpen} />
                <Stack
                    display="flex"
                    flexDirection="column"
                    spacing={4}
                    ml={4}
                    flexGrow={1}
                >
                    <Paper
                        sx={{
                            flex: '0 1 auto',
                            px: 4,
                            pt: 4,
                            pb: 2,
                            borderRadius: 4,
                            boxShadow: 0
                        }}
                    >
                        <CustomHeader />
                        <CustomBreadcrumb data={breadcrumbData} />
                        <Stack direction='row' mt={2}>
                            <Box flexGrow={1}>
                                <CustomTab />
                            </Box>
                            <Box>
                                <CustomFilterBar />
                            </Box>
                        </Stack>

                    </Paper>
                    <Box
                        flexGrow={1}
                        sx={{
                            //                     '--dot-bg': alpha(theme.palette.background.default, 0.2),  // Initial opacity (20%)
                            //                     '--dot-color': theme.palette.mode === "light"
                            //                         ? alpha(theme.palette.text.secondary, 0.2)  // Initial opacity (20%)
                            //                         : alpha(theme.palette.grey[700], 0.2),      // Initial opacity (20%)
                            //                     '--dot-size': '1px',
                            //                     '--dot-space': '15px',
                            //                     background: `
                            //     linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
                            //     linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
                            //     var(--dot-color)
                            // `,
                            overflow: 'hidden',
                            width: open ? '85vw' : '94vw',
                            transition: 'width 0.3s',
                            // transition: 'all 0.3s ease',  // Smooth transition when hover happens
                            // border: "2px solid",
                            // borderColor: "transparent",
                            // '&:hover': {
                            //     borderColor: theme.palette.background.default,
                            //     '--dot-bg': alpha(theme.palette.background.default, 0.5),  // Opacity on hover (30%)
                            //     '--dot-color': theme.palette.mode === "light"
                            //         ? alpha(theme.palette.text.secondary, 0.5)  // Opacity on hover (30%)
                            //         : alpha(theme.palette.grey[700], 0.5)       // Opacity on hover (30%)
                            // }
                        }}
                    >
                        {children}
                    </Box>
                </Stack>
            </Stack>
            <CustomAddTaskDialog />
        </Box>
    );
}

export default Project;
