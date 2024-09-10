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

const ProjectDashBoard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);

    return (

        <Card sx={{ width: 'fit-content' }}>
            <Typography>
                Processing Project dashboard...
            </Typography>
        </Card>

    );
}

export default ProjectDashBoard;
