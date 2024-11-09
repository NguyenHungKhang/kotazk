import { Box, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
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

const Workspace = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { workspaceId } = useParams();
    // const [workspace, setWorkspace] = useState(null);

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
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1 p-7">
                <Stack direction='column' height='100%' spacing={2}>
                    {/* <CustomHeader />
                    <CustomBreadcrumb /> */}
                    <Divider
                        sx={{
                            my: 2
                        }}
                    />
                    <ListProject />
                </Stack>
            </div>
        </div>
    );
}

export default Workspace;