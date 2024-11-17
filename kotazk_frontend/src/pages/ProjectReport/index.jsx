import { Box, Button, Card, Divider, Grid2, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomLinechart from './CustomLinechart';
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react'
import { useSelector } from 'react-redux';
import CustomBarchart from './CustomBarchart';
import CustomStackedBar from './CustomStackedBar';
import CustomGroupeddBar from './CustomGroupedBar';
import CustomPiechart from './CustomPiechart';
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import CustomAddChartDialog from './CustomAddChartDialog';
import CustomFullChartDialog from './CustomFullChartDialog';
import { setAddAndUpdateReportDialog, setDeleteDialog, setFullReportDialog } from '../../redux/actions/dialog.action';
import { useDispatch } from 'react-redux';
import { setProjectReports } from '../../redux/actions/projectReport.action';

const ProjectReport = () => {

    // const [projectReports, setProjectReports] = useState([]);
    const projectReports = useSelector((state) => state.projectReport.currentProjecReportList);
    const section = useSelector((state) => state.section.currentSection);
    const theme = useTheme();
    const dispatch = useDispatch();

    const ExpandIcon = TablerIcons["IconArrowsMaximize"];
    const EditIcon = TablerIcons["IconPencil"];
    const RemoveIcon = TablerIcons["IconX"];

    useEffect(() => {
        if (section)
            fetchProjectReport();
    }, [section])

    const fetchProjectReport = async () => {
        const data = {
            "sortBy": "position",
            "sortDirectionAsc": true,
            "pageSize": 15,
            "filters": []
        }

        const response = await apiService.projectReport.getPageBySection(section?.id, data)
        if (response?.data)
            dispatch(setProjectReports(response?.data?.content))
    }

    const handleExpand = (pr) => {
        const data = {
            open: true,
            props: {
                name: pr.name,
                type: pr.type,
                chartData: pr.items,
                chartNamesAndColors: pr.colorsAndNames,
                xType: pr.xtype,
                yType: pr.ytype,
            }
        }

        dispatch(setFullReportDialog(data));
    };

    const handleOpenDeleteDialog = (pr) => {
        dispatch(setDeleteDialog({
            title: `Delete project report "${pr?.name}"?`,
            content:
                `You're about to permanently delete this project report`,
            open: true,
            deleteType: "DELETE_PROJECT_REPORT",
            deleteProps: {
                projectReportId: pr?.id
            }
            // deleteAction: () => handleDelete(),
        }));
    }

    const handleOpenAddAndEditDialog = (pr = null) => {
        dispatch(setAddAndUpdateReportDialog({
            open: true,
            props: pr ? {
                id: pr.id,
                name: pr.name,
                type: pr.type,
                xType: pr.xtype,
                yType: pr.ytype,
                groupType: pr.groupedBy
            } : null
        }));
    }



    return projectReports == null ? <>Loading...</> : (
        <Box
            height={'100%'}
            width={'100%'}
            overflow={'auto'}
        >
            <Card
                sx={{
                    mb: 2,
                    p: 2
                }}
            >
                <Button onClick={() => handleOpenAddAndEditDialog(null)}>
                    Add report
                </Button>
            </Card>

            <Grid2 container spacing={2} width={'100%'} height={"100%"}>
                {projectReports?.map((pr, index) => (
                    <Grid2 key={index} item size={4}>
                        <Card
                            sx={{
                                width: '100%',
                                // aspectRatio: '1.615/1',
                                height: '100%',
                                maxHeight: 500
                            }}
                        >
                            <Box px={4} py={2}>
                                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                    <Box flexGrow={1}>
                                        <Typography variant='h6' fontWeight={650}>
                                            {pr.name}
                                        </Typography>
                                    </Box>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <IconButton
                                            size='small'
                                            onClick={() => handleExpand(pr)}
                                        >
                                            <ExpandIcon size={18} />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={() => handleOpenAddAndEditDialog(pr)}
                                        >
                                            <EditIcon size={18} />
                                        </IconButton>
                                        <IconButton
                                            color='error'
                                            size='small'
                                            onClick={() => handleOpenDeleteDialog(pr)}
                                        >
                                            <RemoveIcon size={18} />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Box>
                            <Divider />
                            <Box
                                width={'100%'}
                                height={'100%'}
                                maxHeight={300}
                                p={2}
                            // pb={8}
                            >
                                {pr.type == "BAR_CHART" && (
                                    <CustomBarchart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                                )}
                                {pr.type == "STACKED_BAR" && (
                                    <CustomStackedBar chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                                )}
                                {pr.type == "LINE" && (
                                    <CustomLinechart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                                )}
                                {pr.type == "GROUPED_BAR" && (
                                    <CustomGroupeddBar chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                                )}
                                {pr.type == "PIE" && (
                                    <CustomPiechart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                                )}
                            </Box>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
            <CustomFullChartDialog />
            <CustomAddChartDialog />
        </Box>
    );
};


export default ProjectReport;
