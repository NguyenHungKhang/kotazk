import { Box, Card, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ListProject from "./ListWorkspace";
import { useParams } from "react-router-dom";
import * as apiService from '../../api/index';
import { useDispatch } from "react-redux";
import { setCurrentWorkspace } from "../../redux/actions/workspace.action";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomWorkspaceHeader from "../../components/CustomWorkspaceHeader";

const Workspace = ({ children }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { workspaceId } = useParams();
    const [open, setOpen] = useState(true);
    // const [workspace, setWorkspace] = useState(null);
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const breadcrumbData = [
        {
            "label": workspace?.name,
        },
    ]

    useEffect(() => {
        if (workspaceId != null)
            initalFetch();
    }, [, workspaceId])

    const initalFetch = async () => {
        await apiService.workspaceAPI.getDetailById(workspaceId)
            .then(res => { console.log(res); dispatch(setCurrentWorkspace(res.data)); })
            .catch(err => console.log(err))
    }

    return (
        <Box p={4}
            paddingBottom={"8px !important"}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
                // backgroundImage: `url('https://i.pinimg.com/736x/d1/de/5e/d1de5ede98e95b2a8cc7e71a84f506a2.jpg')`,
                background: theme.palette.mode === 'dark'
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