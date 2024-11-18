import React, { useState } from "react";
import { Box, Container, InputBase, Stack } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import CustomHeader from "../../components/CustomHeader";
import SideBar from "../../components/SideBar";
import ListWorkspace from "./ListWorkspace"; // Đảm bảo import ListWorkspace
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const WorkSpace1 = () => {
    const [open, setOpen] = useState(true);

    return (
        <div className="flex">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <div className="h-screen flex-1 p-7">
                {/* Custom Header */}
                <CustomHeader />
                
                {/* Main Container */}
                <Container>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        {/* Search Bar */}
                        <InputBase
                            placeholder="Search..."
                            startAdornment={<SearchIcon />}
                            sx={{
                                bgcolor: 'background.paper',
                                p: 1,
                                borderRadius: 1,
                                boxShadow: 1,
                                width: '60%',
                            }}
                        />
                        {/* Create Workspace Button */}
                        <Stack direction="row" spacing={2}>
                            <button>Create Workspace</button>
                        </Stack>
                    </Stack>
                </Container>

                {/* Breadcrumb */}
                <CustomBreadcrumb />

                {/* List of Workspaces */}
                <Box mt={4}>
                    <ListWorkspace />
                </Box>
            </div>
        </div>
    );
};

export default WorkSpace1;
