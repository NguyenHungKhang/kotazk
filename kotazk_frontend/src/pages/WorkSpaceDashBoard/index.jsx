import { Stack } from "@mui/material";
import ListProject from "../WorkSpace/ListWorkspace";
import React from "react";

const WorkspaceDashBoard = () => {

    return (
        <Stack spacing={2} height={'100%'} >
            <ListProject />
        </Stack>
    );
}

export default WorkspaceDashBoard;