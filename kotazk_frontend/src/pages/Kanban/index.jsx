import { Box, Divider, Stack, useTheme } from "@mui/material";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import CustomHeader from "../../components/CustomHeader";
import SideBar from "../../components/SideBar";
import KanbanDropNDrag from "./KanbanDropNDrag";
import CustomTab from "../../components/CustomTab";
import CustomFilterBar from "../../components/CustomFilterBar";
import { getSecondBackgroundColor } from "../../utils/themeUtil";

const Kanban = () => {
    const theme = useTheme();
    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1 p-7">
                <Box
                    height='100%'
                    display="flex"
                    flexDirection="column"
                >
                    <CustomHeader />
                    <CustomBreadcrumb />
                    <Stack direction='row' mt={2}>
                        <Box flexGrow={1}>
                            <CustomTab />
                        </Box>
                        <Box>
                            <CustomFilterBar />
                        </Box>
                    </Stack>
                    <Divider
                        sx={{
                            my: 2
                        }}
                    />
                    <Box
                        borderRadius={2}
                        bgcolor={getSecondBackgroundColor(theme)}
                        flexGrow={1}
                        sx={{
                            mt: 2,
                            p: 4,
                        }}
                    >
                        <KanbanDropNDrag />
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default Kanban;
