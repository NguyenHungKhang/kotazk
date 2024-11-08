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

const dummyMemberData = [
    {
        id: 1,
        name: 'John Doe',
        user: {
            firstName: "Khang",
            lastName: "Nguyễn",
            email: 'john.doe@example.com',
        },
        // avatarUrl: 'https://i.pravatar.cc/150?img=1',
        role: {
            id: 1,
            name: 'Admin',
        }
    },
];

const dummyRoleData = [
    {
        id: 1,
        name: 'Admin',
    },
    {
        id: 2,
        name: 'Editor',
    },
];


const ProjectMember = () => {
    const theme = useTheme();
    const [activeMembers, setActiveMembers] = useState([])

    return (
        <Grid2 container spacing={2} height={'100% !important'}>
            <Grid2
                item
                size={8}
                height={'100% !important'}
            >
                   <MemberList members={activeMembers} setMembers={setActiveMembers} />
            </Grid2>
            <Grid2 item size={4}>
                <Invitation activeMembers={activeMembers} setActiveMembers={setActiveMembers}/>
            </Grid2>
        </Grid2>

    );
}

export default ProjectMember;