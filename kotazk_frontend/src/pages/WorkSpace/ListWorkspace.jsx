// ListProject.js
import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Divider, Grid, Grid2, Stack, TextField, Typography, useTheme } from "@mui/material";
import CustomProjectCard from '../../components/CustomProjectCard';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react';
import CustomSaveProjectDialog from '../../components/CustomSaveProjectDialog';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentProjectList } from '../../redux/actions/project.action';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import { styled } from '@mui/material/styles';
import { getWorkspaceCover } from '../../utils/coverUtil';
import dayjs from 'dayjs';

const ListProject = () => {
    const theme = useTheme();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const projectList = useSelector((state) => state.project.currentProjectList);
    const pinnedProject = projectList?.content?.filter(p => p.isPinned == true);
    const [searchText, setSearchText] = useState("");
    const SearchIcon = TablerIcons["IconSearch"];
    const ExpandIcon = TablerIcons["IconCaretDownFilled"];
    const currentMember = useSelector((state) => state.member.currentWorkspaceMember);

    const createProjectPermission = currentMember?.role?.workSpacePermissions?.includes("CREATE_PROJECT");

    const dispatch = useDispatch();

    useEffect(() => {
        if (workspace != null)
            initialFetch();
    }, [searchText, workspace]);


    const initialFetch = async () => {
        const data = {
            "sortBy": "name",
            "sortDirectionAsc": true,
            "filters": [
                {
                    "key": "name",
                    "operation": "LIKE",
                    "value": searchText
                }
            ]
        }
        await apiService.projectAPI.getPageByWorkspace(workspace.id, data)
            .then(res => { dispatch(setCurrentProjectList(res.data)); })
            .catch(err => console.warn(err))
    }

    const getTimeOfDay = () => {
        const currentHour = dayjs().hour(); // Get current hour (0-23)

        if (currentHour >= 5 && currentHour < 12) {
            return "Morning"; // 5:00 AM to 11:59 AM
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Afternoon"; // 12:00 PM to 5:59 PM
        } else {
            return "Evening"; // 6:00 PM to 4:59 AM
        }
    };

    return (
        <Stack spacing={2} width={'100%'} height={'100%'}>
            {/* <Box sx={{ position: 'relative', width: '100%' }}>
                <Box
                    sx={{
                        width: '100%',
                        paddingTop: '10%',
                        backgroundImage: `url(${getWorkspaceCover(workspace?.id, workspace?.cover)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 1,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
            </Box> */}
            <Card
                sx={{
                    p: 4,
                    height: '100%',
                    overflow: 'auto'
                }}
            >
                <Stack direction='row' spacing={2} alignItems='center' mb={2}>
                    <Stack direction='row' spacing={2} alignItems='center' flexGrow={1}>
                        {createProjectPermission && (
                            <Box>
                                <CustomSaveProjectDialog />
                            </Box>
                        )}

                        <Box flexGrow={1}>
                            <TextField
                                size='small'
                                placeholder='Enter to search...'
                                onChange={(e) => setSearchText(e.target.value)}
                                InputProps={{
                                    startAdornment:
                                        <Box mr={1}>
                                            <SearchIcon size={20} />
                                        </Box>
                                }}
                            />
                        </Box>
                    </Stack>

                </Stack>

                <Accordion
                    sx={{
                        boxShadow: 0,
                        border: 'none',
                        "&:before": {
                            display: 'none'
                        }
                    }}
                    defaultExpanded
                >
                    <AccordionSummary
                        sx={{
                            width: '100%',
                        }}
                        expandIcon={<ExpandIcon />}
                    >
                        <Box width={'100%'}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2} width={'100%'}>
                                <Typography variant='h6' fontWeight={650}>
                                    Pinned projects ({pinnedProject?.length})
                                </Typography>
                                <Box flexGrow={1}>
                                    <Divider />
                                </Box>
                            </Stack>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {pinnedProject?.length > 0 ?
                            <Grid container spacing={4}>
                                {pinnedProject?.map((project) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} xl={12 / 5} key={project.id}>
                                        <CustomProjectCard project={project} theme={theme} />
                                    </Grid>
                                ))}
                            </Grid>
                            :
                            <Box
                                width={307}
                                height={173}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                border={"1px dashed"}
                                borderColor={getCustomTwoModeColor(theme, theme.palette.grey[400], theme.palette.grey[700])}
                                borderRadius={2}
                            >
                                <Typography variant='h6' color={getCustomTwoModeColor(theme, theme.palette.grey[400], theme.palette.grey[700])}>
                                    There is no pinned projects
                                </Typography>
                            </Box>
                        }


                    </AccordionDetails>
                </Accordion>

                <Accordion
                    sx={{
                        boxShadow: 0,
                        border: 'none',
                        "&:before": {
                            display: 'none'
                        }
                    }}
                    defaultExpanded
                >
                    <AccordionSummary
                        sx={{
                            width: '100%'
                        }}
                        expandIcon={<ExpandIcon />}
                    >
                        <Box width={'100%'}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2} width={'100%'}>
                                <Typography variant='h6' fontWeight={650}>
                                    Projects ({projectList?.totalElements})
                                </Typography>
                                <Box flexGrow={1}>
                                    <Divider />
                                </Box>
                            </Stack>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {projectList?.content?.length > 0 ?
                            <Grid container spacing={4}>
                                {projectList?.content?.map((project) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} xl={12 / 5} key={project.id}>
                                        <CustomProjectCard project={project} theme={theme} />
                                    </Grid>
                                ))}
                            </Grid>
                            :
                            <Box
                                width={307}
                                height={173}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                border={"1px dashed"}
                                borderColor={getCustomTwoModeColor(theme, theme.palette.grey[400], theme.palette.grey[700])}
                                borderRadius={2}
                            >
                                <Typography variant='h6' color={getCustomTwoModeColor(theme, theme.palette.grey[400], theme.palette.grey[700])}>
                                    There is no projects
                                </Typography>
                            </Box>
                        }
                    </AccordionDetails>
                </Accordion>


            </Card>
        </Stack>
    );
}

export default ListProject;
