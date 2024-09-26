import { Avatar, Box, Card, CardContent, Chip, Divider, IconButton, Stack, Tooltip, Typography, lighten, styled, useTheme } from "@mui/material";
import * as allIcons from "@tabler/icons-react"
import { useState } from "react";
import CustomTaskDialog from "../../components/CustomTaskDialog";
import { useDispatch } from "react-redux";
import { setTaskDialog } from "../../redux/actions/dialog.action";
import dayjs from "dayjs";
import CustomStatus from "../../components/CustomStatus";
import { useSelector } from "react-redux";
import CustomTaskType from "../../components/CustomTaskType";
import CustomPriority from "../../components/CustomPriority";
import CustomLabel from "../../components/CustomLabel";
import { setShowLabel } from "../../redux/actions/label.action";
import CustomMember from "../../components/CustomMember";
import CardKanbanMenu from "./CardKanbanMenu";

const FieldBoxForKanbanCard = styled((props) => <Stack {...props} />)(
    ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderRadius: 10, // borderRadius={10}
    })
);

const CardKanban = ({ task, isDragging }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [displayLabels, setDisplayLabels] = useState(false);
    const showLabel = useSelector((state) => state.label.showLabel);
    const statuses = useSelector((state) => state.status.currentStatusList);
    const taskTypes = useSelector((state) => state.taskType.currentTaskTypeList);
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const labels = useSelector((state) => state.label.currentLabelList)
    const members = useSelector((state) => state.member.currentProjectMemberList)
    const CalendarIcon = allIcons["IconCalendar"];
    const TimeIcon = allIcons["IconClock2"];
    const AttachmentIcon = allIcons["IconPaperclip"];
    const CommentIcon = allIcons["IconMessageDots"];
    const PriorityIcon = allIcons["IconFlag"]
    const MoreIcon = allIcons["IconDots"]

    const openTaskDialog = () => {
        const taskDialogData = {
            task: task,
            open: true
        }
        console.log(taskDialogData);
        dispatch(setTaskDialog(taskDialogData));
    }

    const handleChangeShowLabel = () => {
        dispatch(setShowLabel(!showLabel))
    }

    const getAssignee = (id) => {
        const member = members.find(m => m.id === id);
        return member ? `${member.user.firstName} ${member.user.lastName}` : "Unassigned";
    };


    return (
        <Card
            onClick={openTaskDialog}
            sx={{
                // bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#22272B",
                width: 320,
                borderRadius: 2,
                boxShadow: 1,
                border: '2px solid',
                borderColor: isDragging ? theme.palette.info.main : (theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700]),
                transform: isDragging ? 'rotate(2deg)' : null,
                // borderColor: "transparent",
                '&:hover': {
                    borderColor: theme.palette.primary.main
                }
            }}
        >
            <CardContent
                sx={{
                    p: 4
                }}
            >

                {task?.labels?.length > 0 &&
                    <Stack direction='row' spacing={2}>
                        <Stack
                            flexGrow={1}
                            direction='row'
                            spacing={2}
                            alignItems='center'
                            flexWrap='wrap'
                            useFlexGap
                            mb={2}
                            sx={{
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleChangeShowLabel();
                            }}
                        >
                            {task?.labels.map((l) => (
                                <CustomLabel key={l.id} label={labels.find(i => i.labelId === l.id)} />
                            ))}

                        </Stack>
                        <CardKanbanMenu task={task} />
                    </Stack>
                }

                <Stack direction="row" spacing={2} alignItems='center'>
                    <Box
                        mb={1}
                        mt={2}
                        borderRadius={2}
                        py={1}
                        sx={{
                            "&:hover": {
                                px: 1,
                                bgcolor: theme.palette.mode === 'light'
                                    ? theme.palette.grey[200]
                                    : theme.palette.grey[800],
                                transition: 'all 0.2s ease'
                            }
                        }}
                    >
                        <CustomTaskType taskType={taskTypes.find(t => t.id === task?.taskTypeId)} changeable={false} displayTextOnHoverOnly={true} />
                    </Box>
                    <Typography variant='body2' fontWeight='bold' noWrap flexGrow={1}>
                        {task?.name}
                    </Typography>
                    {task?.labels?.length <= 0 &&
                        <CardKanbanMenu task={task} />
                    }
                </Stack>

                {/* <Typography variant='body2' color={theme.palette.text.secondary} noWrap>
                    Test desciption a akjn al la a a las la va
                </Typography> */}
                <Divider sx={{ my: 2 }} />

                <CustomStatus status={statuses.find(s => s.id === task?.statusId)} changeable={false} />

                <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap
                    sx={{
                        mt: 2
                    }}
                >
                    {
                        task?.endAt &&

                        <FieldBoxForKanbanCard px={2} py={1}>
                            <Tooltip title="Due date-time" placement="top">
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <CalendarIcon color={theme.palette.text.secondary} size={16} />
                                    <Typography color={theme.palette.text.secondary} variant='body2'>
                                        {dayjs(task?.endAt).format("HH:mm MM/DD/YYYY")}
                                    </Typography>
                                </Stack>
                            </Tooltip>
                        </FieldBoxForKanbanCard>

                    }
                    {task?.priorityId &&
                        <FieldBoxForKanbanCard px={2} py={0.5}>
                            <Tooltip title="Priority" placement="top">
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <PriorityIcon color={theme.palette.text.secondary} size={16} />
                                    <Typography color={theme.palette.text.secondary} variant='body2'>
                                        {priorities.find(p => p.id === task?.priorityId).name}
                                    </Typography>
                                </Stack>
                            </Tooltip>
                        </FieldBoxForKanbanCard>

                    }

                    {/* <Stack direction='row' alignItems='center' spacing={1}>
                        <AttachmentIcon color={theme.palette.text.secondary} size={16} />
                        <Typography color={theme.palette.text.secondary} variant='body2'>
                            2
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <CommentIcon color={theme.palette.text.secondary} size={16} />
                        <Typography color={theme.palette.text.secondary} variant='body2'>
                            2
                        </Typography>
                    </Stack> */}
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Tooltip title={task?.assigneeId ? getAssignee(task.assigneeId) : "Unassigned"} placement="top">
                            {task?.assigneeId ? (
                                <Box>
                                    <CustomMember
                                        member={members.find(m => m.id === task.assigneeId)}
                                        isShowName={false}
                                    />
                                </Box>
                            ) : (
                                <Avatar
                                    alt="Unassigned"
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        border: "2px dotted",
                                        borderColor: theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[400],
                                    }}
                                />
                            )}
                        </Tooltip>
                    </Box>

                </Stack>
            </CardContent>
        </Card >
    );
}



export default CardKanban;