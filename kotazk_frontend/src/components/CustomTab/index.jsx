import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Divider, IconButton, Skeleton, Stack, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // Icon ba chấm ngang
import * as TablerIcons from '@tabler/icons-react'
import { useSelector, useDispatch } from 'react-redux';
import * as apiService from '../../api/index'
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AddSectionDialog from './AddSectionDialog';
import { setSection } from '../../redux/actions/section.action';

const ListIcon = TablerIcons["IconListDetails"];
const BoardIcon = TablerIcons["IconLayoutKanbanFilled"];
const CalendarIcon = TablerIcons["IconCalendarMonth"];
const TimelineIcon = TablerIcons["IconTimelineEvent"];
const FileIcon = TablerIcons["IconPaperclip"];
const ReportIcon = TablerIcons["IconChartInfographic"];


const AntTabs = styled(Tabs)(({ theme }) => ({
    alignItems: 'center',
    minHeight: 0,
}));

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    minHeight: 0,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: '4px', // khoảng cách giữa các icon và label
    [theme.breakpoints.up('sm')]: {
        minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        color: theme.palette.grey[500],
        opacity: 1,
    },
    '&.Mui-selected': {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.getContrastText(theme.palette.background.default),
        fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
        backgroundColor: theme.palette.mode === 'dark' ? '#d1eaff' : '#d1eaff',
    },
}));

export default function CustomTab() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sections = useSelector((state) => state.section.currentSectionList)
    // const [sections, setSections] = useState();
    const { sectionId } = useParams();
    const project = useSelector((state) => state.project.currentProject);;

    // useEffect(() => {
    //     if (project != null)
    //         initialFetch();
    // }, [project]);

    // const initialFetch = async () => {
    //     const data = {
    //         "filters": []
    //     }
    //     await apiService.sectionAPI.getPageByProject(project.id, data)
    //         .then(res => setSections(res.data))
    //         .catch(err => console.warn(err));
    // }


    const handleNavigate = (section) => {
        navigate(`/project/${project?.id}/section/${section?.id}`);
    }

    const getIconBySectionType = (type) => {
        switch (type) {
            case "KANBAN":
                return (<BoardIcon size={18} />)
            case "LIST":
                return (<ListIcon size={18} />)
            case "CALENDAR":
                return (<CalendarIcon size={18} />)
            case "FILE":
                return (<FileIcon size={18} />)
            case "REPORT":
                return (<ReportIcon size={18} />)
        }
    }

    return sections == null ? <Skeleton variant='rounded' width={'100%'} height={'100%'} /> : (
        <Box sx={{ width: '100%' }}>

            <Stack direction='row' spacing={2} alignItems='center'>
                <AntTabs
                    aria-label="ant example"
                    TabIndicatorProps={{
                        style: { display: 'none' }
                    }}
                    value={Number(sectionId) || 0}
                >
                    <AntTab
                        value={0}
                        label={
                            <Box component={Link} to={`/project/${project?.id}/`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HomeIcon sx={{ fontSize: 20 }} />
                                <span>Dashboard</span>
                                {sectionId == null && (
                                    <IconButton
                                        sx={{
                                            p: 0.5,
                                            m: 0,
                                            ml: 1,
                                            color: theme.palette.background.default,
                                            transition: 'opacity 0.3s ease',
                                        }}
                                        size='small'
                                        className="more-icon"
                                    >
                                        <MoreHorizIcon fontSize='small' />
                                    </IconButton>
                                )}
                            </Box>
                        }
                    />
                    {sections?.map((section, index) => (
                        <AntTab
                            value={section.id}
                            key={index + 1}
                            label={
                                <Box onClick={() => handleNavigate(section)} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getIconBySectionType(section.type)}
                                    <span>{section.name}</span>
                                    {Number(sectionId) === section?.id && ( // Chỉ render icon khi tab được chọn
                                        <IconButton
                                            sx={{
                                                p: 0.5,
                                                m: 0,
                                                ml: 1,
                                                color: theme.palette.background.default,
                                                transition: 'opacity 0.3s ease',
                                            }}
                                            size='small'
                                            className="more-icon"
                                        >
                                            <MoreHorizIcon fontSize='small' />
                                        </IconButton>
                                    )}
                                </Box>
                            }
                        />
                    ))}
                </AntTabs>
                <Box py={2}>
                    <Divider orientation="vertical" variant="middle" flexItem />
                </Box>
                <Box>
                    <AddSectionDialog />
                </Box>
            </Stack>

        </Box>
    );
}
