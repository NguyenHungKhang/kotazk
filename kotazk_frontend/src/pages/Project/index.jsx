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
import { setCurrentProjectMemberList, setCurrentUserMember } from "../../redux/actions/member.action";
import CustomAddTaskDialog from "../../components/CustomAddTaskDialog";
import { setCurrentWorkspace } from "../../redux/actions/workspace.action";
import { setSectionList } from "../../redux/actions/section.action";
import { setTaskSearchText } from "../../redux/actions/searchText.action";

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
            "href": `/workspace/${workspace?.id}/projects`
        },
        {
            "label": project?.name,
        }
    ]
    useEffect(() => {
        if (projectId != null) {
            fetchInitial();
            getCurrentUser();
        }
    }, [projectId])

    const getCurrentUser = async () => {
        try {
            const res = await apiService.memberAPI.getCurrentOneByProject(projectId);
            if (res?.data) {
                dispatch(setCurrentUserMember(res?.data))
            }
        } catch (err) {
            console.error('Error fetching current member details:', err);
        }
    };

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
            dispatch(setCurrentWorkspace(workSpace));
            dispatch(setSectionList(sections));
            dispatch(setTaskSearchText(""));
        } catch (err) {
            console.error('Error fetching project details:', err);
        }
    };


    return (
        <Box p={4}
            paddingBottom={"8px !important"}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
                backgroundImage: project?.cover ? `url(${project?.cover})` : null,
                background: project?.cover ? null : theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #522580, #223799)'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Stack direction='row' spacing={2} alignItems="stretch" height={"calc(100% - 12px)"}>
                <SideBar open={open} setOpen={setOpen} />
                <Stack
                    display="flex"
                    flexDirection="column"
                    spacing={2}
                    ml={4}
                    flexGrow={1}
                >
                    <Paper
                        sx={{
                            flex: '0 1 auto',
                            px: 4,
                            pt: 4,
                            pb: 2,
                            borderRadius: 2,
                            boxShadow: 0
                        }}
                    >
                        <CustomHeader />
                        <CustomBreadcrumb data={breadcrumbData} />
                        <Stack direction='row' mt={2} spacing={6} alignItems={'center'}>
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
                          
                            overflow: 'hidden',
                            width: open ? '86vw' : '95vw',
                            transition: 'width 0.3s',
                           
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
