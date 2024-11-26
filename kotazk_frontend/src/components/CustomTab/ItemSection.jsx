import { Box, Typography, useTheme } from "@mui/material";
import MenuSection from "./MenuSection";
import * as TablerIcons from '@tabler/icons-react'
import { useEffect, useState } from "react";
import CustomBasicTextField from "../CustomBasicTextField";
import * as apiService from "../../api/index"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSectionList } from "../../redux/actions/section.action";
import { updateAndAddArray } from "../../utils/arrayUtil";

const ListIcon = TablerIcons["IconListDetails"];
const BoardIcon = TablerIcons["IconLayoutKanbanFilled"];
const CalendarIcon = TablerIcons["IconCalendarMonth"];
const FileIcon = TablerIcons["IconPaperclip"];
const ReportIcon = TablerIcons["IconChartInfographic"];

const ItemSection = ({ section, sectionId }) => {
    const theme = useTheme();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(null);
    const sections = useSelector((state) => state.section.currentSectionList);
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const dispatch = useDispatch();

    useEffect(() => {
        if (section)
            setName(section.name);
    }, [section]);

    const getIconBySectionType = (type) => {
        switch (type) {
            case "KANBAN":
                return <BoardIcon size={18} />;
            case "LIST":
                return <ListIcon size={18} />;
            case "CALENDAR":
                return <CalendarIcon size={18} />;
            case "FILE":
                return <FileIcon size={18} />;
            case "REPORT":
                return <ReportIcon size={18} />;
            default:
                return null;
        }
    };


    const handleCloseEditing = async () => {
        const data = {
            "name": name
        }

        const response = await apiService.sectionAPI.update(section.id, data);
        if (response?.data) {
            const finalSections = updateAndAddArray(sections, [response?.data]);
            dispatch(setSectionList(finalSections))
        }
        setEditing(false);

    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 1,
                textDecoration: 'none',
                cursor: 'pointer',
                backgroundColor: Number(sectionId) === section.id ? theme.palette.primary.main : 'transparent',
                color: Number(sectionId) === section.id ? theme.palette.primary.contrastText : theme.palette.text.primary,
                '&:hover': {
                    backgroundColor: Number(sectionId) === section.id
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                },
            }}
        >
            {getIconBySectionType(section.type)}

            {(editing && currentMember?.projectPermissions?.includes("MANAGE_SECTION")) ?
                <Box>
                    <CustomBasicTextField
                        size='small'
                        fullWidth
                        defaultValue={section.name}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        //   onBlur={() => handleSave()}
                        sx={{
                            "& .MuiInputBase-input": {
                                padding: 0,
                                color: "#fff",
                                minWidth: 150
                            },
                        }}
                        onBlur={() => handleCloseEditing()}
                    />
                </Box>
                :
                <>
                    <Typography
                        variant="body2"
                        sx={{
                            textWrap: 'nowrap',
                            textTransform: 'none',
                        }}
                    >
                        {section.name}
                    </Typography>
                    {(Number(sectionId) === section.id && currentMember?.projectPermissions?.includes("MANAGE_SECTION")) && (
                        <MenuSection section={section} setEditing={setEditing} />
                    )}
                </>
            }
        </Box>
    );
}

export default ItemSection;