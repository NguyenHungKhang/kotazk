import { Box, Button, ButtonGroup, Fab, InputAdornment, Skeleton, Stack, TextField, Tooltip, darken, useTheme } from "@mui/material";
import LayersIcon from '@mui/icons-material/Layers';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as allIcons from "@tabler/icons-react"
import { useDispatch } from "react-redux";
import { setAddTaskDialog } from "../../redux/actions/dialog.action";
import CustomFilterDialog from "../CustomFilterDialog";
import CustomGroupedByDialog from "../CustomGroupByDialog";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as apiService from '../../api/index'
import { setSection } from "../../redux/actions/section.action";
import { setSnackbar } from "../../redux/actions/snackbar.action";
import { initialCurrentFilterList } from "../../redux/actions/filter.action";
import { initialCurrentGroupByEntity } from "../../redux/actions/groupBy.action";
import CustomSortDialog from "../CustomSortDialog";
import { initialCurrentSortEntity } from "../../redux/actions/sort.action";
import { setTaskSearchText } from "../../redux/actions/searchText.action";
import { useLocation, useParams } from "react-router-dom";

const CustomFilterBar = () => {
    const location = useLocation();
    const { projectId, sectionId } = useParams();
    const theme = useTheme();
    const section = useSelector((state) => state.section.currentSection)
    const userChangeFilterList = useSelector((state) => state.filter.userChangeFilterList);
    const userChangeGroupByEntity = useSelector((state) => state.groupBy.userChangeGroupByEntity);
    const userChangeSortEntity = useSelector((state) => state.sort.userChangeSortEntity);
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const InfoIcon = allIcons["IconInfoSquareRoundedFilled"];
    const isSectionPage = location.pathname.startsWith("/project/") && sectionId;

    return section == null ? <Skeleton variant="rounded" width={'100%'} height={'100%'} /> : (
        <Stack direction='row' spacing={2} alignItems={'center'}>
            {section?.type != "REPORT" && isSectionPage
                &&
                (
                    <>
                        <SearchTextField />
                        <Tooltip placement="top" title="You can save section view if your member role has permision to manage section" arrow>
                            <InfoIcon size={20} color={theme.palette.text.secondary} />
                        </Tooltip>
                        {((userChangeFilterList || userChangeGroupByEntity || userChangeSortEntity) && currentMember?.role?.projectPermissions?.includes("MANAGE_SECTION")) && (
                            < CustomSaveSectionButton sectionId={section?.id} />
                        )}

                        <CustomFilterDialog section={section} />
                        {(section?.type === "KANBAN" || section?.type === "LIST") && <CustomGroupedByDialog />}

                        <CustomSortDialog />
                        {
                            currentMember?.role?.projectPermissions?.includes("CREATE_TASKS") && (
                                <CustomAddTaskButton />
                            )
                        }
                        <Stack direction={'row'}>
                            <Box
                                border={"1px solid"}
                                borderColor={theme.palette.info.main}
                                p={1}
                                sx={{
                                    borderRadius: "4px 0 0 4px"
                                }}
                            >
                                50
                            </Box>
                            <Button variant="contained" size="small" color="info"
                                sx={{
                                    borderRadius: "0 4px 4px 0"
                                }}
                            >
                                Load Tasks
                            </Button>
                        </Stack>
                    </>
                )
            }
        </Stack>
    );
}

const CustomSaveSectionButton = ({ sectionId }) => {
    const theme = useTheme();
    const AddIcon = allIcons["IconDeviceFloppy"];
    const dispatch = useDispatch();
    const currentFilterList = useSelector((state) => state.filter.currentFilterList)
    const currentGroupByEntity = useSelector((state) => state.groupBy.currentGroupByEntity)
    const currentSortEntity = useSelector((state) => state.sort.currentSortEntity)
    const currentSortDirection = useSelector((state) => state.sort.currentSortDirection)

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(true);
        const timer = setTimeout(() => {
            setOpen(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);


    const handleSave = async () => {
        const data = {
            "filterSettings": currentFilterList.map(f => ({
                "field": f.field,
                "operator": "IN",
                "values": f.options.map(String)
            })),
            "groupBySetting": currentGroupByEntity ? {
                "field": currentGroupByEntity
            } : null,
            "sortSetting": currentSortEntity ? {
                "field": currentSortEntity,
                "asc": currentSortDirection == "ascending" ? true : false
            } : null
        }
        const response = await apiService.sectionAPI.update(sectionId, data);
        if (response?.data) {
            dispatch(setSection(response?.data))
            dispatch(initialCurrentFilterList(response?.data?.filterSettings?.map(f => ({
                "field": f.field,
                "options": f.values
            }))));
            dispatch(initialCurrentGroupByEntity({ "currentGroupByEntity": response?.data?.groupBySetting?.field }));
            dispatch(setSnackbar({
                content: "Section update successfully!",
                open: true
            }));
            dispatch(initialCurrentSortEntity({
                "entity": response?.data?.sortSetting?.field ?? "position",
                "asc": response?.data?.sortSetting?.asc == false ? "descending" : "ascending"
            }));
        }
    }

    return (
        <Tooltip placement="top" title="Click for save filter, grouping and sorting of section" open={open} onClose={() => setOpen(false)} arrow>
            <Button
                size='small'
                variant="contained"
                sx={{
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #9CDAF8  30%, #98FCBD 90%)',
                    color: '#000',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #98FCBD 30%, #9CDAF8 90%)',
                    },
                }}
                startIcon={
                    <AddIcon size={16} />
                }
                onClick={handleSave}
            >
                Save
            </Button>
        </Tooltip>

    );
}

const CustomAddTaskButton = () => {
    const theme = useTheme();
    const AddIcon = allIcons["IconPlus"];
    const dispatch = useDispatch();

    const handleOpenAddTaskDialog = () => {
        dispatch(setAddTaskDialog({ open: true }))
    }

    return (

        <Button
            size='small'
            variant="contained"
            sx={{
                textTransform: 'none',
                textWrap: 'nowrap',
                background: 'linear-gradient(45deg, #FF3259 30%, #FF705A 90%)',
                color: '#FFFFFF',
                '&:hover': {
                    background: 'linear-gradient(45deg, #FF705A 30%, #FF3259 90%)',
                },
            }}
            startIcon={
                <AddIcon size={16} />
            }
            onClick={handleOpenAddTaskDialog}
        >
            Add task
        </Button>

    );
}

const SearchTextField = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const SearchIcon = allIcons["IconSearch"];
    const ApplySearchIcon = allIcons["IconZoomCheckFilled"];
    const [searchValue, setSearchValue] = useState("");
    const [isSearchApplied, setIsSearchApplied] = useState(false);

    const handleOnChange = (e) => {
        setSearchValue(e.target.value);
        setIsSearchApplied(false); // Reset the icon when the user starts typing
    };

    const applySearch = async () => {
        await dispatch(setTaskSearchText(searchValue.trim().replace(/\s+/g, " ")));
        if (searchValue.trim() != "")
            setIsSearchApplied(true);
        else
            setIsSearchApplied(false);
    };

    const handleOnBlur = () => {
        applySearch();
    };

    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            applySearch();
        }
    };

    return (
        <Tooltip placement="top" title="Press enter or click out for apply search text" arrow>
            <TextField
                size="small"
                placeholder="Type to search..."
                value={searchValue}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onKeyPress={handleOnKeyPress}
                sx={{
                    "& .MuiInputBase-root": {
                        height: "30px",
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {isSearchApplied ? (
                                <ApplySearchIcon size={20} stroke={2} />
                            ) : (
                                <SearchIcon size={20} stroke={2} />
                            )}
                        </InputAdornment>
                    ),
                }}
            />
        </Tooltip>
    );
};

export default CustomFilterBar;
