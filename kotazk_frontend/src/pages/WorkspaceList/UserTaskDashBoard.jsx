import { Box, Card, Divider, Stack, Tabs, Tab, Typography, alpha, darken, useTheme, Grid2, Paper, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import * as apiService from "../../api/index";
import { setAlertDialog, setTaskDialog } from "../../redux/actions/dialog.action";
import CustomTaskDialog from "../../components/CustomTaskDialog";
import CustomTaskType from "../../components/CustomTaskType";
import CustomStatus from "../../components/CustomStatus";
import { getCustomTwoModeColor } from "../../utils/themeUtil";
// import WeekTaskCalendar from "./WeekTaskCalendar";
import { getProjectCover } from "../../utils/coverUtil";
import CustomWeekTaskCalendar from "../../components/CustomWeekTaskCalendar";
import { setCurrentUserMember } from "../../redux/actions/member.action";
import { setCurrentProject } from "../../redux/actions/project.action";

const UserTaskDashBoard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    const [todayTasks, setTodayTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [uncompletedTasks, setUncompletedTasks] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const tasks = useSelector((state) => state.task.currentTaskList)

    useEffect(() => {
        if (currentUser) {
            todayTaskFetch();
            overdueTasksFetch();
            completedTaskFetch();
            uncompletedTaskFetch();
        }
    }, [currentUser, tasks]);

    const todayTaskFetch = async () => {
        console.log(123)
        const data = {
            filters: [
                { key: "isCompleted", value: "false", operation: "EQUAL" },
                { key: "assignee.user.id", value: currentUser.id.toString(), operation: "EQUAL" },
                {
                    specificTimestampFilter: true,
                    specificTimestampFilterNotNull: true,
                    values: [dayjs().startOf("day").valueOf()],
                },
            ],
        };

        const response = await apiService.taskAPI.getPageByUser(data);
        if (response?.data) {
            setTodayTasks(response?.data.content);
        }
    };

    const uncompletedTaskFetch = async () => {
        const data = {
            filters: [
                { key: "isCompleted", value: "false", operation: "EQUAL" },
                { key: "assignee.user.id", value: currentUser.id.toString(), operation: "EQUAL" },
            ],
        };

        const response = await apiService.taskAPI.getPageByUser(data);
        if (response?.data) {
            setUncompletedTasks(response?.data.content);
        }
    };

    const overdueTasksFetch = async () => {
        const data = {
            filters: [
                { key: "isCompleted", value: "false", operation: "EQUAL" },
                { key: "assignee.user.id", value: currentUser.id.toString(), operation: "EQUAL" },
                { key: "endAt", value: dayjs().valueOf(), operation: "LESS_THAN" },
            ],
        };

        const response = await apiService.taskAPI.getPageByUser(data);
        if (response?.data) {
            setOverdueTasks(response?.data.content);
        }
    };

    const completedTaskFetch = async () => {
        const data = {
            filters: [
                { key: "isCompleted", value: "true", operation: "EQUAL" },
                { key: "assignee.user.id", value: currentUser.id.toString(), operation: "EQUAL" },
            ],
        };

        const response = await apiService.taskAPI.getPageByUser(data);
        if (response?.data) {
            setCompletedTasks(response?.data.content);
        }
    };

    const openTaskDialog = async (task) => {
        try {
            const response = await apiService.memberAPI.getCurrentOneByProject(task?.project?.id)
            if (response?.data) {
                dispatch(setCurrentProject(task?.project))
                dispatch(setCurrentUserMember(response?.data))
                dispatch(setTaskDialog({ task, open: true }));
            }
        } catch (e) {
            dispatch(setAlertDialog({
                open: true,
                props: {
                    title: "Access Denied",
                    content: `You do not have permission to modify this task.
                    <br/><br/>
                    Please contact the workspace administrator if you believe this is a mistake.`,
                    actionUrl: null
                },
                type: "error",
            }))
        }

    };

    const renderTasks = (tasks) => {
        return tasks.map((task, index) => (
            <Box
                key={task.id}
                p={1}
                borderTop={"1px solid"}
                borderBottom={index == tasks.length - 1 ? "1px solid" : null}
                borderColor={"divider"}
                sx={{
                    cursor: "pointer",
                    "&:hover": {
                        bgcolor: getCustomTwoModeColor(
                            theme,
                            darken(theme.palette.background.default, 0.1),
                            darken(theme.palette.background.paper, 0.1)
                        ),
                    },
                }}
                onClick={() => openTaskDialog(task)}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box flexGrow={1}>
                        <Typography>{task.name}</Typography>
                    </Box>
                    <Box>
                        <Chip label={task?.project?.workSpace?.name} size="small" />
                    </Box>
                    <Box>
                        /
                    </Box>
                    <Box>
                        <Chip label={task?.project?.name} size="small" />
                    </Box>

                    <CustomTaskType taskType={task?.taskType} changeable={false} displayTextOnHoverOnly={false} />
                    <CustomStatus status={task?.status} changeable={false} />
                    {task?.priority && (
                        <Typography
                            sx={{
                                bgcolor: task?.priority?.customization?.backgroundColor,
                                color: theme.palette.getContrastText(task?.priority?.customization?.backgroundColor),
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                            }}
                        >
                            {task?.priority?.name}
                        </Typography>
                    )}
                </Stack >
            </Box >
        ));
    };

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
        <Stack
            sx={{
                height: "100%",
                overflow: "auto",
            }}
            spacing={2}
        >
            <Grid2 container spacing={2}>
                <Grid2 size={3} height={'fit-content'} >
                    <Paper
                        sx={{
                            p: 2,
                            boxShadow: 0
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.info.main, 0.2),
                                p: 2,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h1" fontWeight={500} color="info" textAlign={'center'}>
                                {todayTasks.length}
                            </Typography>
                            <Typography variant="h6" textAlign={'center'}>
                                Today tasks
                            </Typography>
                        </Box>
                    </Paper>
                </Grid2>
                <Grid2 size={3} height={'fit-content'}>
                    <Paper
                        sx={{
                            p: 2,
                            boxShadow: 0
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                p: 2,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h1" fontWeight={500} color="error" textAlign={'center'}>
                                {overdueTasks.length}
                            </Typography>
                            <Typography variant="h6" textAlign={'center'}>
                                Overdue tasks
                            </Typography>
                        </Box>
                    </Paper>
                </Grid2>
                <Grid2 size={3} height={'fit-content'}>
                    <Paper
                        sx={{
                            p: 2,
                            boxShadow: 0
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                p: 2,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h1" fontWeight={500} color="success" textAlign={'center'}>
                                {completedTasks.length}
                            </Typography>
                            <Typography variant="h6" textAlign={'center'}>
                                Completed tasks
                            </Typography>
                        </Box>
                    </Paper>
                </Grid2>
                <Grid2 size={3} height={'fit-content'}>
                    <Paper
                        sx={{
                            p: 2,
                            boxShadow: 0
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                p: 2,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h1" fontWeight={500} color="warning" textAlign={'center'}>
                                {uncompletedTasks.length}
                            </Typography>
                            <Typography variant="h6" textAlign={'center'}>
                                Uncompleted tasks
                            </Typography>
                        </Box>
                    </Paper>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={2} height={'100%'}>
                <Grid2 size={6}>
                    <Card sx={{ height: "100%", p: 4, boxShadow: 0, borderRadius: 2 }}>
                        <Typography
                            variant="h6"
                            fontWeight={'bold'}
                            p={2}
                        >
                            My tasks
                        </Typography>
                        <Tabs
                            value={tabIndex}
                            onChange={(event, newIndex) => setTabIndex(newIndex)}
                            // sx={{ borderBottom: 1, borderColor: "divider" }}
                            sx={{
                                minHeight: 0,
                                "& .MuiTab-root": {
                                    fontSize: 14,
                                    textTransform: 'none',
                                    p: 2,
                                    minHeight: 0,
                                    height: 'fit-content'
                                }
                            }}
                        >
                            <Tab label={
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.info.main, 0.2),
                                        p: 2
                                    }}
                                >
                                    <Typography color="info" fontWeight={650}>
                                        Today Tasks
                                    </Typography>
                                </Box>
                            } />
                            <Tab label={
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.error.main, 0.2),
                                        p: 2
                                    }}
                                >
                                    <Typography color="error" fontWeight={650}>
                                        Overdue Tasks
                                    </Typography>
                                </Box>
                            } />
                            <Tab label={
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.success.main, 0.2),
                                        p: 2
                                    }}
                                >
                                    <Typography color="success" fontWeight={650}>
                                        Completed Tasks
                                    </Typography>
                                </Box>
                            } />
                            <Tab label={
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                                        p: 2
                                    }}
                                >
                                    <Typography color="warning" fontWeight={650}>
                                        Uncompleted Tasks
                                    </Typography>
                                </Box>
                            } />
                        </Tabs>
                        <Divider />
                        <Stack my={2} px={4} sx={{ height: "100%" }}>
                            {tabIndex === 0 && renderTasks(todayTasks)}
                            {tabIndex === 1 && renderTasks(overdueTasks)}
                            {tabIndex === 2 && renderTasks(completedTasks)}
                            {tabIndex === 3 && renderTasks(uncompletedTasks)}
                        </Stack>
                    </Card>
                </Grid2>
                <Grid2 size={6}>
                    <Card sx={{ height: "100%", p: 4, boxShadow: 0, borderRadius: 2 }}>
                        <CustomWeekTaskCalendar tasks={todayTasks} />
                    </Card>
                </Grid2>
            </Grid2>

            <CustomTaskDialog />
        </Stack>

    );
};

export default UserTaskDashBoard;
