import { Box, Card, Divider, Grid2, Stack, Tooltip, Typography, alpha, darken, useTheme } from "@mui/material";
import CustomBreadcrumb from "../../components/CustomBreadcumbs";
import CustomHeader from "../../components/CustomHeader";
import SideBar from "../../components/SideBar";
import CustomTab from "../../components/CustomTab";
import CustomFilterBar from "../../components/CustomFilterBar";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import * as apiService from '../../api/index'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../../redux/actions/project.action";
import dayjs from "dayjs";
import CustomTaskDialog from "../../components/CustomTaskDialog";
import CustomStatus from "../../components/CustomStatus";
import CustomTaskType from "../../components/CustomTaskType";
import { setTaskDialog } from "../../redux/actions/dialog.action";

const ProjectDashBoard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const [todayTasks, setTodayTasks] = useState([]);

    useEffect(() => {
        if (project)
            todayTaskFetch();
    }, [project])

    const todayTaskFetch = async () => {
        const response = await apiService.taskAPI.getTodayTask(project.id)
        if (response?.data) {
            setTodayTasks(response?.data.content);
        }
    }

    const openTaskDialog = (task) => {
        const taskDialogData = {
            task: task,
            open: true
        }
        dispatch(setTaskDialog(taskDialogData));
    }
    return (

        <Box sx={{
            height: '100%',
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            p: 4,
            overflow: 'auto'
        }}>

            <Card
                sx={{
                    p: 4,
                    mb: 2
                }}
            >
                <Typography variant="h6" textAlign={'center'}>
                    {dayjs().format("dddd, MMMM DD YYYY")}
                </Typography>
                <Typography variant="h4" fontWeight={650} textAlign={'center'}>
                    Good Evening, Khang!
                </Typography>
            </Card>
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Card
                        sx={{
                            p: 4,
                            height: '100%'
                        }}
                    >
                        <Typography variant="h6" fontWeight={650}>
                            My today tasks
                        </Typography>
                        <Stack spacing={1}>
                            {todayTasks?.map((task) => (
                                <Box
                                    key={task.id}
                                    border={'1px solid'}
                                    p={1}
                                    borderRadius={2}
                                    sx={{
                                        cursor: 'pointer',
                                        "&:hover": {
                                            bgcolor: getCustomTwoModeColor(theme, darken(theme.palette.background.default, 0.1), darken(theme.palette.background.paper, 0.1))
                                        }
                                    }}
                                // borderColor={''}
                                >
                                    <Stack
                                        direction={'row'}
                                        spacing={2}
                                        alignItems={'center'}
                                        onClick={() => openTaskDialog(task)}

                                    >
                                        <Box flexGrow={1}>
                                            <Typography>
                                                {task.name}
                                            </Typography>
                                        </Box>
                                        <CustomTaskType taskType={task?.taskType} changeable={false} displayTextOnHoverOnly={false} />
                                        <CustomStatus status={task?.status} changeable={false} />
                                        {task?.priority && (

                                            <Tooltip title="Priority" placement="top">
                                                <Stack direction='row' alignItems='center' spacing={1}
                                                    sx={{
                                                        bgcolor: task?.priority?.customization?.backgroundColor,
                                                        py: 1,
                                                        px: 2,
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    {/* <PriorityIcon color={theme.palette.getContrastText(task?.priority?.customization?.backgroundColor)} size={16} /> */}
                                                    <Typography color={theme.palette.getContrastText(task?.priority?.customization?.backgroundColor)} variant='body2'>
                                                        {task?.priority?.name}
                                                    </Typography>
                                                </Stack>
                                            </Tooltip>
                                        )}
                                    </Stack>

                                </Box>

                            ))}

                        </Stack>
                    </Card>
                </Grid2>
                <Grid2 size={4}>
                    <Grid2 container spacing={2} height={'100%'}>
                        <Grid2 size={12}>
                            <Card
                                sx={{
                                    p: 4,
                                    height: '100%'
                                }}
                            >

                            </Card>
                        </Grid2>

                        <Grid2 size={12}>
                            <Card
                                sx={{
                                    p: 4,
                                    height: '100%'
                                }}
                            >

                            </Card>
                        </Grid2>

                    </Grid2>
                </Grid2>
                <Grid2 size={3}>
                    <Card
                        sx={{
                            p: 4,
                            height: '100%'
                        }}
                    >

                    </Card>
                </Grid2>
            </Grid2>
            <CustomTaskDialog />
        </Box>

    );
}

export default ProjectDashBoard;
