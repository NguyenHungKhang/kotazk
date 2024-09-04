import { Box, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import MemberList from "./MemberList";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ProjectMemberHeader from "./ProjectMemberHeader";

const ProjectMember = () => {
    const theme = useTheme();
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1 p-7">
                <Stack direction='column' height='100%' spacing={2}>
                    <CustomHeader />
                    <CustomBreadcrumb />
                    <Divider
                        sx={{
                            my: 2
                        }}
                    />
                    <ProjectMemberHeader />
                    <Box
                        borderRadius={2}
                        bgcolor={getSecondBackgroundColor(theme)}
                        flexGrow={1}
                        sx={{
                            p: 2
                        }}
                    >
                        <MemberList />
                    </Box>
                </Stack>
            </div>
        </div>
    );
}

export default ProjectMember;