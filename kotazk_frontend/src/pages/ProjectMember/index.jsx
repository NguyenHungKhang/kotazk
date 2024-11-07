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
    const [members, setMembers] = useState(dummyMemberData);
    const [memberRoles, setMemberRoles] = useState(dummyRoleData);
    const project = useSelector((state) => state.project.currentProject)
    const workSpace = useSelector((state) => state.workspace.currentWorkspace)

    useEffect(() => {
        if (project != null && workSpace != null)
            initialFetch();
    }, [project, workSpace]);

    const initialFetch = async () => {
        try {
            const memberFilter = {
                filters: [
                    // {
                    //     key: "project.id",
                    //     operation: "EQUAL",
                    //     value: project?.id,
                    //     values: []
                    // }
                ],
            };

            const memberRoleFilter = {
                filters: [
                    // {
                    //     key: "project.id",
                    //     operation: "EQUAL",
                    //     value: project?.id,
                    //     values: []
                    // }
                ],
            };

            // Run both API calls concurrently
            const [memberResponse, memberRoleResponse] = await Promise.all([
                apiService.memberAPI.getPageByProject(memberFilter, project?.id),
                apiService.memberRoleAPI.getPageByProject(memberRoleFilter, project?.id)
            ]);

            // Handle member response
            if (memberResponse?.data?.content) {
                setMembers(memberResponse.data.content);
            }

            // Handle member role response
            if (memberRoleResponse?.data?.content) {
                setMemberRoles(memberRoleResponse.data.content);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // Optionally handle the error, e.g., show a notification or fallback state
        }
    };


    return (
        <Grid2 container spacing={2} height={'100% !important'}>
            <Grid2
                item
                size={8}
                height={'100% !important'}
            >
            
                    {/* <ProjectMemberHeader /> */}
                    {(members?.length > 0 && memberRoles?.length > 0) && <MemberList members={members} memberRoles={memberRoles} />}
            </Grid2>
            <Grid2 item size={4}>
                <Invitation />
            </Grid2>
        </Grid2>

    );
}

export default ProjectMember;