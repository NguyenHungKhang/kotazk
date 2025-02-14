import { Box, Button, Card, Chip, Divider, Grid2, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomLinechart from './CustomLinechart';
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react'
import { useSelector } from 'react-redux';
import CustomBarchart from './CustomBarchart';
import CustomStackedBar from './CustomStackedBar';
import CustomGroupeddBar from './CustomGroupedBar';
import CustomPiechart from './CustomPiechart';
import { getCustomTwoModeColor, getSecondBackgroundColor } from '../../utils/themeUtil';
import CustomAddChartDialog from './CustomAddChartDialog';
import CustomFullChartDialog from './CustomFullChartDialog';
import { setAddAndUpdateReportDialog, setDeleteDialog, setFullReportDialog } from '../../redux/actions/dialog.action';
import { useDispatch } from 'react-redux';
import { setProjectReports } from '../../redux/actions/projectReport.action';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CustomNumberReport from './CustomNumberReport';

const ProjectReport = () => {

    // const [projectReports, setProjectReports] = useState([]);
    const projectReports = useSelector((state) => state.projectReport.currentProjecReportList);
    const section = useSelector((state) => state.section.currentSection);
    const theme = useTheme();
    const dispatch = useDispatch();

    const ExpandIcon = TablerIcons["IconArrowsMaximize"];
    const EditIcon = TablerIcons["IconPencil"];
    const RemoveIcon = TablerIcons["IconX"];
    const FilterIcon = TablerIcons["IconFilter"];
    const MoveLeftIcon = TablerIcons["IconChevronLeft"];
    const MoveRightIcon = TablerIcons["IconChevronRight"];
    const ReportIcon = TablerIcons["IconChartHistogram"];
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const manageReportPermission = currentMember?.role?.projectPermissions?.includes("MANAGE_REPORT");

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
                numberValue: pr.numberValue
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
                groupType: pr.groupedBy,
                filterSettings: pr.filterSettings,
                numberValue: pr.numberValue
            } : null
        }));
    }

    const onMovePosition = async (reportId, direction) => {
        const index = projectReports.findIndex(report => report.id === reportId);

        if (
            index === -1 ||
            (direction === "left" && index === 0) ||
            (direction === "right" && index === projectReports.length - 1)
        ) {
            return { left: null, right: null }; // Return nulls if no move is possible
        }

        const swapIndex = direction === "left" ? index - 1 : index + 1;

        const reorderedReports = [...projectReports];
        [reorderedReports[index], reorderedReports[swapIndex]] = [
            reorderedReports[swapIndex],
            reorderedReports[index],
        ];

        dispatch(setProjectReports(reorderedReports));

        // Get the new position of the current report
        const newIndex = swapIndex;
        const leftId = newIndex > 0 ? reorderedReports[newIndex - 1].id : null;
        const rightId =
            newIndex < reorderedReports.length - 1
                ? reorderedReports[newIndex + 1].id
                : null;

        const data = {
            "currentItemId": reportId,
            "nextItemId": rightId,
            "previousItemId": leftId

        }

        const response = await apiService.projectReport.reposition(section?.id, data);

    };


    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        const reorderedReports = Array.from(projectReports);
        const [reorderedReport] = reorderedReports.splice(source.index, 1);
        reorderedReports.splice(destination.index, 0, reorderedReport);

        dispatch(setProjectReports(reorderedReports));
    };

    return projectReports == null ? <>Loading...</> : (
        <Box height={'100%'} width={'100%'} overflow={'auto'}>
            {manageReportPermission && (
                <Paper
                    onClick={() => handleOpenAddAndEditDialog(null)}
                    sx={{
                        boxShadow: 0,
                        mb: 2,
                        p: 4,
                        border: '2px dashed',
                        cursor: "pointer",
                        transition: 'all .5s',
                        "&:hover": {
                            bgcolor: getCustomTwoModeColor(theme, theme.palette.grey[200], theme.palette.grey[900]),
                        }
                    }}
                >
                    <Stack direction={'row'} spacing={4}>

                        <ReportIcon size={70} />

                        <Box>
                            <Typography variant='h4' fontWeight={650}>
                                Add report
                            </Typography>
                            <Typography color='textSencodary'>
                                The Add Report feature allows users to create and submit detailed reports regarding their tasks, projects, or overall performance. This feature is essential for tracking progress, documenting achievements, and providing valuable insights to stakeholders or team members.
                            </Typography>
                        </Box>
                    </Stack>


                </Paper>
            )}

            {/* Kéo thả các thẻ báo cáo */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="reports" direction="horizontal">
                    {(provided) => (
                        <Grid2 container spacing={2} width={'100%'} height={"100%"} {...provided.droppableProps} ref={provided.innerRef}>
                            {projectReports?.map((pr, index) => (
                                <Draggable isDragDisabled key={pr.id} draggableId={pr.id.toString()} index={index}>
                                    {(provided) => (
                                        <Grid2 size={pr.type == "NUMBER" ? 3 : 6} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <Card sx={{ width: '100%', height: '100%', maxHeight: pr.type == "NUMBER" ? 200 : 380 }}>
                                                <Box px={4} py={2}>
                                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                                        <Typography variant='h6' flexGrow={1} fontWeight={650} noWrap
                                                            sx={{
                                                                whiteSpace: 'nowrap',      // Prevent text wrapping
                                                                overflow: 'hidden',        // Hide overflowed text
                                                                textOverflow: 'ellipsis',  // Add ellipsis (...)
                                                            }}
                                                        >
                                                            {pr.name}
                                                        </Typography>
                                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                            <Chip icon={<FilterIcon size={18} />} label={`${pr?.filterSettings?.length == 0 ? "No " : pr?.filterSettings?.length} Filter${pr?.filterSettings?.length != 1 ? 's' : ''}`} />
                                                            {manageReportPermission && (
                                                                <>
                                                                    <IconButton size='small' onClick={() => onMovePosition(pr.id, "left")}>
                                                                        <MoveLeftIcon size={18} />
                                                                    </IconButton>
                                                                    <IconButton size='small' onClick={() => onMovePosition(pr.id, "right")}>
                                                                        <MoveRightIcon size={18} />
                                                                    </IconButton>
                                                                </>
                                                            )}

                                                            <IconButton size='small' onClick={() => handleExpand(pr)}>
                                                                <ExpandIcon size={18} />
                                                            </IconButton>
                                                            {manageReportPermission && (
                                                                <>
                                                                    <IconButton size='small' onClick={() => handleOpenAddAndEditDialog(pr)}>
                                                                        <EditIcon size={18} />
                                                                    </IconButton>
                                                                    <IconButton color='error' size='small' onClick={() => handleOpenDeleteDialog(pr)}>
                                                                        <RemoveIcon size={18} />
                                                                    </IconButton>
                                                                </>
                                                            )}

                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                                <Divider />
                                                <Box width={'100%'} height={'100%'} maxHeight={pr.type == "NUMBER" ? 150 : 300} p={2}>
                                                    {pr.type == "BAR_CHART" && <CustomBarchart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />}
                                                    {pr.type == "STACKED_BAR" && <CustomStackedBar chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />}
                                                    {pr.type == "LINE" && <CustomLinechart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />}
                                                    {pr.type == "GROUPED_BAR" && <CustomGroupeddBar chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />}
                                                    {pr.type == "PIE" && <CustomPiechart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />}
                                                    {pr.type == "NUMBER" && <CustomNumberReport number={pr.numberValue} yType={pr.ytype} />}
                                                </Box>
                                            </Card>
                                        </Grid2>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <Grid2 height={380}></Grid2>
                        </Grid2>
                    )}
                </Droppable>
            </DragDropContext>

            <CustomFullChartDialog />
            <CustomAddChartDialog />
        </Box>
    );
};


export default ProjectReport;
