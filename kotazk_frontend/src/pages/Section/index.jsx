import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Kanban from "../Kanban";
import ProjectList from "../ProjectList";
import ProjectCalendar from "../ProjectCalendar";
import { useParams } from "react-router-dom";

const Section = () => {
    const { sectionId } = useParams();
    const sections = useSelector((state) => state.section.currentSectionList)
    const [section, setSection] = useState(null);

    useEffect(() => {
        if (sections != null && sectionId != null) {
            const selectedSection = sections?.find(s => s.id == sectionId)
            setSection(selectedSection)
        }
    }, [sections, sectionId])

    return section == null ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
        <>
            {section?.type == "KANBAN" && <Kanban />}
            {section?.type == "LIST" && <ProjectList />}
            {section?.type == "CALENDAR" && <ProjectCalendar />}
        </>
    );
}

export default Section;