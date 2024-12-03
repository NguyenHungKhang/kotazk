<<<<<<< HEAD
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
=======
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Kanban from "../Kanban";
import ProjectList from "../ProjectList";
import ProjectCalendar from "../ProjectCalendar";
import { useParams } from "react-router-dom";
import ProjectReport from "../ProjectReport";
import { useDispatch } from "react-redux";
import { setSection } from "../../redux/actions/section.action";
import * as apiService from '../../api/index'
import { initialCurrentFilterList, setCurrentFilterList } from "../../redux/actions/filter.action";
import { initialCurrentGroupByEntity } from "../../redux/actions/groupBy.action";
import { initialCurrentSortEntity } from "../../redux/actions/sort.action";

const Section = () => {
    const { sectionId } = useParams();
    const sections = useSelector((state) => state.section.currentSectionList)
    // const [section, setSection] = useState(null);
    const section = useSelector((state) => state.section.currentSection)

    const dispatch = useDispatch();

    useEffect(() => {
        if (sections != null && sectionId != null)
            sectionFetch();
    }, [sections, sectionId])

    const sectionFetch = async () => {
        const response = await apiService.sectionAPI.getOne(sectionId);
        if (response?.data) {
            setSection(response?.data)
            dispatch(setSection(response?.data));
            dispatch(initialCurrentFilterList(response?.data?.filterSettings?.map(f => ({
                "field": f.field,
                "options": f.values
            }))));
            dispatch(initialCurrentGroupByEntity({ "currentGroupByEntity": response?.data?.groupBySetting?.field ?? "status" }));
            dispatch(initialCurrentSortEntity({
                "entity": response?.data?.sortSetting?.field ?? "position",
                "asc": response?.data?.sortSetting?.asc == false ? "descending" : "ascending"
            }));
        }
    }

    return section == null ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
        <>
            {section?.type == "KANBAN" && <Kanban />}
            {section?.type == "LIST" && <ProjectList />}
            {section?.type == "CALENDAR" && <ProjectCalendar />}
            {section?.type == "REPORT" && <ProjectReport />}
        </>
    );
}

export default Section;
>>>>>>> origin/develop
