import { useTheme } from "@mui/material";
import KanbanDropNDrag from "./KanbanDropNDrag";
import * as apiService from "../../api/index"
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Kanban = () => {
    const theme = useTheme();
    const project = useSelector((state) => state.project.currentProject)
    const [taskes, setTaskes] = useState(null);

    useEffect(() => {
        if (project != null)
            initialFetch();
    }, [project]);

    const initialFetch = async () => {
        const data = {
            'filters': []
        };
        await apiService.taskAPI.getPageByProject(project.id, data)
            .then(res => console.log(res))
            .catch(err => console.warn(err));
    }

    return (<KanbanDropNDrag />);
}

export default Kanban;
