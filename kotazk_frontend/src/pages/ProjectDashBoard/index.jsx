import { Box, Card, Divider, Stack, Tabs, Tab, Typography, alpha, darken, useTheme, Grid2 } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import * as apiService from "../../api/index";
import { setTaskDialog } from "../../redux/actions/dialog.action";
import CustomTaskDialog from "../../components/CustomTaskDialog";
import CustomTaskType from "../../components/CustomTaskType";
import CustomStatus from "../../components/CustomStatus";
import { getCustomTwoModeColor } from "../../utils/themeUtil";
import WeekTaskCalendar from "./WeekTaskCalendar";

const ProjectDashBoard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const currentMember = useSelector((state) => state.member.currentUserMember);

    const [todayTasks, setTodayTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        if (project && currentMember) {
            todayTaskFetch();
            overdueTasksFetch();
            completedTaskFetch();
        }
    }, [project, currentMember]);

    const todayTaskFetch = async () => {
        const data = {
            filters: [
                { key: "isCompleted", value: "false", operation: "EQUAL" },
                { key: "assignee.id", value: currentMember.id.toString(), operation: "EQUAL" },
                {
                    specificTimestampFilter: true,
                    specificTimestampFilterNotNull: true,
                    values: [dayjs().startOf("day").valueOf()],
                },
            ],
        };

        const response = await apiService.taskAPI.getPageByProject(project.id, data);
        if (response?.data) {
            setTodayTasks(response?.data.content);
        }
    };

    const overdueTasksFetch = async () => {
        const data = {
            filters: [
                { key: "isCompleted", value: "false", operation: "EQUAL" },
                { key: "assignee.id", value: currentMember.id.toString(), operation: "EQUAL" },
                { key: "endAt", value: dayjs().valueOf(), operation: "LESS_THAN" },
            ],
        };

        const response = await apiService.taskAPI.getPageByProject(project.id, data);
        if (response?.data) {
            setOverdueTasks(response?.data.content);
        }
    };

    const completedTaskFetch = async () => {
        const data = {
            filters: [
                { key: "isCompleted", value: "true", operation: "EQUAL" },
                { key: "assignee.id", value: currentMember.id.toString(), operation: "EQUAL" },
            ],
        };

        const response = await apiService.taskAPI.getPageByProject(project.id, data);
        if (response?.data) {
            setCompletedTasks(response?.data.content);
        }
    };

    const openTaskDialog = (task) => {
        dispatch(setTaskDialog({ task, open: true }));
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
                </Stack>
            </Box>
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
        <>
            <Stack
                sx={{
                    height: "100%",
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    p: 2,
                    overflow: "auto",
                }}
            >
                <Card sx={{ p: 4, mb: 2 }}>
                    <Typography variant="h6" textAlign="center">
                        {dayjs().format("dddd, MMMM DD YYYY")}
                    </Typography>
                    <Typography variant="h4" fontWeight={650} textAlign="center">
                        Good {getTimeOfDay()}, Khang!
                    </Typography>
                </Card>
                <Grid2 container spacing={2} height={'100%'}>
                    <Grid2 size={6}>
                        <Card sx={{ height: "100%" }}>
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
                                <Tab label="Today Tasks" sx={{ fontSize: 14, textTransform: 'none' }} />
                                <Tab label="Overdue Tasks" />
                                <Tab label="Completed Tasks" />
                            </Tabs>
                            <Divider />
                            <Stack my={2} px={4}>
                                {tabIndex === 0 && renderTasks(todayTasks)}
                                {tabIndex === 1 && renderTasks(overdueTasks)}
                                {tabIndex === 2 && renderTasks(completedTasks)}
                            </Stack>
                        </Card>
                    </Grid2>
                    <Grid2 size={6}>
                        <Card sx={{ height: "100%" }}>
                            <WeekTaskCalendar tasks={todayTasks} />
                        </Card>
                    </Grid2>
                </Grid2>


            </Stack>
            <CustomTaskDialog />
        </>
    );
};

export default ProjectDashBoard;
