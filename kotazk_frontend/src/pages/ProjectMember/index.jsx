import { Box, Card, Container, Divider, Grid, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
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

const ProjectMember = () => {
    const theme = useTheme();
    const [members, setMembers] = useState(null);
    const [memberRoles, setMemberRoles] = useState(null);
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
        <Grid container spacing={2}>
            <Grid xs={6}>
                <Card
                    sx={{
                        p: 4,
                        width: '100%'
                    }}
                >
                    <ProjectMemberHeader />
                    {(members?.length > 0 && memberRoles?.length > 0) && <MemberList members={members} memberRoles={memberRoles} />}
                </Card>
            </Grid>
            <Grid xs={6}>

            </Grid>
        </Grid>

    );
}

export default ProjectMember;