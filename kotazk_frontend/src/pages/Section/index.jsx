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