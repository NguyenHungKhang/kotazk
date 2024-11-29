import { Box, Button, Card, Container, Divider, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import SideBar from "../../components/SideBar";
import CustomHeader from "../../components/CustomHeader";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import { blueGrey, deepPurple, indigo } from "@mui/material/colors";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import ListProject from "../WorkSpace/ListWorkspace";
import React from "react";
import CustomDialogForManage from "../../components/CustomDialogForManage";
import WorkSpaceMember from "../WorkSpaceMember";
import CustomWorkspaceHeader from "../../components/CustomWorkspaceHeader";

const WorkspaceDashBoard = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [maxWidth, setMaxWidth] = React.useState("sm");
    const [children, setChildren] = React.useState(<WorkSpaceMember />);


    return (
        <Stack spacing={2} height={'100%'} >
            <ListProject />
        </Stack>
    );
}

export default WorkspaceDashBoard;