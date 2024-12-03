import { Box, Card, Container, Divider, Grid, Grid2, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import MemberList from "./MemberList";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ProjectMemberHeader from "./ProjectMemberHeader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as apiService from '../../api/index'
import Invitation from "./Invition";
import AddProjectMember from "./AddProjectMember";


const ProjectMember = () => {
    const theme = useTheme();
    const [activeMembers, setActiveMembers] = useState([])

    return (
        <Grid2 container spacing={2} height={'100% !important'}>
            {/* <Grid2>
                <AddProjectMember currentMembers={members} currentRoleMembers={memberRoles} />
            </Grid2> */}
            <Grid2
                item
                size={12}
                height={'100% !important'}
            >
                <MemberList members={activeMembers} setMembers={setActiveMembers} />
            </Grid2>
            {/* <Grid2 item size={4}>
                <Invitation activeMembers={activeMembers} setActiveMembers={setActiveMembers} />
            </Grid2> */}
        </Grid2>

    );
}

export default ProjectMember;