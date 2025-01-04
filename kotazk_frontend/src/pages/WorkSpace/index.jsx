import { Box, Card, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ListProject from "./ListWorkspace";
import { useNavigate, useParams } from "react-router-dom";
import * as apiService from '../../api/index';
import { useDispatch } from "react-redux";
import { setCurrentWorkspace } from "../../redux/actions/workspace.action";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomWorkspaceHeader from "../../components/CustomWorkspaceHeader";
import { setCurrentWorkspaceMember } from "../../redux/actions/member.action";
import { setAlertDialog } from "../../redux/actions/dialog.action";
import { setCurrentProject } from "../../redux/actions/project.action";

const Workspace = ({ children }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { workspaceId } = useParams();
    const [open, setOpen] = useState(true);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const navigate = useNavigate();


    const breadcrumbData = [
        {
            "label": workspace?.name,
        },
    ]

    const getCurrentUser = async () => {
        try {
            const res = await apiService.memberAPI.getCurrentOneByWorkspace(workspaceId);
            if (res?.data) {
                dispatch(setCurrentWorkspaceMember(res?.data))
                if (!res?.data?.role?.workSpacePermissions?.includes("BROWSE_WORKSPACE"))
                    dispatch(setAlertDialog({
                        open: true,
                        props: {
                            title: "Access Denied",
                            content: `You do not have permission to access this workspace.
                        <br/><br/>
                        Please contact the workspace administrator if you believe this is a mistake.`,
                            actionUrl: `/workspace`
                        },
                        type: "error",
                    }))
            }
        } catch (err) {
            console.error('Error fetching current member details:', err);
        }
    };

    useEffect(() => {
        if (workspaceId != null) {
            dispatch(setCurrentProject(null))
            dispatch(setCurrentWorkspace(null))
            initalFetch();
            getCurrentUser();
        }
    }, [workspaceId])

    const initalFetch = async () => {
        await apiService.workspaceAPI.getDetailById(workspaceId)
            .then(res => { console.log(res); dispatch(setCurrentWorkspace(res.data)); })
            .catch(err => {
                dispatch(setAlertDialog({
                    open: true,
                    props: {
                        title: "Access Denied",
                        content: `You do not have permission to access this workspace.
                        <br/><br/>
                        Please contact the workspace administrator if you believe this is a mistake.`,
                        actionUrl: `/workspace`
                    },
                    type: "error",
                }))
            })
    }

    return (
        <Box p={4}
            paddingBottom={"8px !important"}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
                backgroundImage: workspace?.cover ? `url(${workspace?.cover})` : null,
                background: workspace?.cover ? null : theme.palette.mode === 'dark'
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
                            py: 4,
                            borderRadius: 2,
                            boxShadow: 0
                        }}
                    >
                        <CustomWorkspaceHeader />
                        <CustomBreadcrumb data={breadcrumbData} />
                    </Paper>

                    <Box
                        flexGrow={1}
                        sx={{

                            overflow: 'hidden',
                            width: open ? '86vw' : '94.2vw',
                            transition: 'width 0.3s',

                        }}
                    >
                        {children}
                    </Box>
                    
                </Stack>
            </Stack>
        </Box>
    );
}

export default Workspace;