import { Box } from "@mui/material";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import CustomHeader from "../../components/CustomHeader";
import SideBar from "../../components/SideBar";
import ListWorkspace from "./ListWorkspace";

const WorkSpace = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="h-screen flex-1 p-7">
                <Box>
                    <CustomHeader />
                    <CustomBreadcrumb />
                    <Box mt={4}>
                        <ListWorkspace />
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default WorkSpace;