import { Box, Container, InputBase, Stack } from "@mui/material";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import CustomHeader from "../../components/CustomHeader";
import SideBar from "../../components/SideBar";
import ListWorkspace from "./ListWorkspace";
import SearchIcon from '@mui/icons-material/Search';

const WorkSpace1 = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="h-screen flex-1 p-7">
                <Box>
                    <CustomHeader />
                    <Container>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
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
                            <Stack direction="row" spacing={2}>
                                <button>Create Workspace</button>
                                {/* <Avatar alt="User Avatar" src="/path/to/avatar.jpg" /> */}
                            </Stack>
                        </Stack>
                    </Container>
                    <CustomBreadcrumb />
                    <Box mt={4}>
                        <ListWorkspace />
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default WorkSpace1;
