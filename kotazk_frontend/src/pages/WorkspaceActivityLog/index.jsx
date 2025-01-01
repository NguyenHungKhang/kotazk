import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Card, Link, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
import { useEffect, useState } from "react";
import * as TablerIcons from '@tabler/icons-react'
import * as apiService from '../../api/index'
import { useSelector } from "react-redux";
import { getAvatar } from "../../utils/avatarUtil";

const WorkspaceActivityLog = () => {
    const theme = useTheme();
    const workspace = useSelector((state) => state.workspace.currentWorkspace);
    const [expanded, setExpanded] = useState(false);
    const ExpandIcon = TablerIcons["IconChevronDown"]
    const [activityLogs, setActivityLogs] = useState([]);
    useEffect(() => {
        if (workspace)
            fetchActivityLogs();
    }, [workspace])

    const fetchActivityLogs = async () => {
        const data = {
            "filters": [
                {
                    "key": "workSpace.id",
                    "operation": "EQUAL",
                    "value": workspace?.id
                },
                {
                    "key": "type",
                    "operation": "EQUAL",
                    "value": "WORKSPACE_HISTORY"
                }
            ]
        }
        const response = await apiService.activityLogAPI.getAll(data)
        if (response?.data)
            setActivityLogs(response?.data)
    }

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <Stack
            sx={{
                height: '100%',
                bgcolor: alpha(theme.palette.background.default, 0.6),
            }}
        >
            <Card
                sx={{
                    p: 2
                }}
            >
                <Typography variant="h6" fontWeight={500}
                    sx={{
                        m: 2
                    }}
                >
                    Workspaec Activity Log
                </Typography>
            </Card>
            <Box
                sx={{
                    flexFlow: 1,
                    overflowY: 'auto',
                    height: '100%'
                }}
            >
                <Stack spacing={1}
                    sx={{
                        m: 2,
                    }}
                >
                    {activityLogs?.length == 0 && (
                        <>There is no activities</>
                    )}
                    {activityLogs?.slice().reverse().map((activityLog, index) => (
                        <Card key={activityLog.id}
                            sx={{
                                p: 2
                            }}
                        >
                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                <Box minWidth={50}>
                                    <Typography fontWeight={'bold'}>
                                        No.{activityLogs?.length - index}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Avatar
                                        sx={{
                                            height: 30,
                                            width: 30,
                                        }}
                                        alt="User Name"
                                        src={getAvatar(activityLog?.user?.id, activityLog?.user?.avatar)}
                                    />
                                </Box>
                                <Box flexGrow={1}>
                                    <Stack direction={'row'} spacing={2}>
                                        <Typography key={activityLog.id} fontWeight={'bold'}>
                                            {activityLog.userText}
                                        </Typography>
                                        <Typography key={activityLog.id}>
                                            {activityLog.content}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    {dayjs(activityLog.createdAt).format("HH:mm MM/DD/YYYY")}
                                </Box>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}
export default WorkspaceActivityLog;