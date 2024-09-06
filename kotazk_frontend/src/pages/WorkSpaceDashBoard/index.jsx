import { Box, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import MemberList from "./MemberList";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ProjectMemberHeader from "./ProjectMemberHeader";

const WorkspaceDashBoard = () => {
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
                </Stack>
            </div>
        </div>
    );
}

export default ProjectMember;