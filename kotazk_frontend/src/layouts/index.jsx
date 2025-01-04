import { Box, Paper, Stack, useTheme } from "@mui/material";
import { useState } from "react";
import CustomBreadcrumb from "../components/CustomBreadcumbs";
import CustomFilterBar from "../components/CustomFilterBar";
import CustomHeader from "../components/CustomHeader";
import CustomTab from "../components/CustomTab";
import SideBar from "../components/SideBar";

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    return (
        <Box p={4}
            paddingBottom={"8px !important"}
            height={"100vh"}
            width={"100vw !important"}
            sx={{
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #522580, #223799)'
                    : '#F3F4F8',
            }}
        >
            <Stack direction='row' spacing={2} alignItems="stretch" height={"calc(100% - 12px)"}>
                <SideBar open={open} setOpen={setOpen} />
                <Stack
                    display="flex"
                    flexDirection="column"
                    spacing={2}
                    ml={4}
                    flexGrow={1}
                >
                    <Paper
                        sx={{
                            flex: '0 1 auto',
                            px: 4,
                            pt: 4,
                            pb: 2,
                            borderRadius: 2,
                            boxShadow: 0
                        }}
                    >
                        <CustomHeader />
                        <CustomBreadcrumb />
                        <Stack direction='row' mt={2} spacing={6} alignItems={'center'}>
                            <Box flexGrow={1}>
                                <CustomTab />
                            </Box>
                            <Box>
                                <CustomFilterBar />
                            </Box>

                        </Stack>

                    </Paper>
                    <Box
                        flexGrow={1}
                        sx={{

                            overflow: 'hidden',
                            width: open ? '86vw' : '95vw',
                            transition: 'width 0.3s',

                        }}
                    >
                        {children}
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}

export default MainLayout;
