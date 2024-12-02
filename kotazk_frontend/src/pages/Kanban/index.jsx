import { useTheme } from "@mui/material";
import KanbanDropNDrag from "./KanbanDropNDrag";
import * as apiService from "../../api/index"
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Kanban = () => {
    return (<KanbanDropNDrag />);
}

export default Kanban;
