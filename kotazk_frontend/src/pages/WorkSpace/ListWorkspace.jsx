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

const ListProject = () => {
    const theme = useTheme();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const projectList = useSelector((state) => state.project.currentProjectList);
    const [searchText, setSearchText] = useState("");
    const SearchIcon = TablerIcons["IconSearch"];
    const ExpandIcon = TablerIcons["IconCaretDownFilled"];

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


    return (
        <Stack spacing={2} width={'100%'} height={'100%'}>
            <Card
                sx={{
                    p: 4,
                    height: '100%'
                }}
            >
                <Stack direction='row' spacing={2} alignItems='center' mb={2}>
                    <Stack direction='row' spacing={2} alignItems='center' flexGrow={1}>
                        <Box>
                            <CustomSaveProjectDialog />
                        </Box>
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
                                    Pinned projects (0)
                                </Typography>
                                <Box flexGrow={1}>
                                    <Divider />
                                </Box>
                            </Stack>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {projectList?.content?.filter(p => p.isPinned == true)?.length > 0 ?
                            <Grid container spacing={4}>
                                {projectList?.content?.filter(p => p.isPinned == true).map((project) => (
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
                        <Grid container spacing={4}>
                            {projectList?.content?.map((project) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={12 / 5} key={project.id}>
                                    <CustomProjectCard project={project} theme={theme} />
                                </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>


            </Card>
        </Stack>
    );
}

export default ListProject;
