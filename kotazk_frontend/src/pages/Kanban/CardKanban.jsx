import { Avatar, Badge, Box, Card, CardContent, Chip, Divider, IconButton, Stack, Tooltip, Typography, lighten, styled, useTheme } from "@mui/material";
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
    const priorities = useSelector((state) => state.priority.currentPriorityList);
    const members = useSelector((state) => state.member.currentProjectMemberList)
    const CalendarIcon = allIcons["IconCalendar"];
    const TimeIcon = allIcons["IconClock2"];
    const AttachmentIcon = allIcons["IconPaperclip"];
    const CommentIcon = allIcons["IconMessageDots"];
    const PriorityIcon = allIcons["IconFlag"]
    const MoreIcon = allIcons["IconDots"]
    const DashedOutlinedCheckCircleIcon = allIcons["IconCircleDashedCheck"];
    const FilledCheckCircleIcon = allIcons["IconCircleCheckFilled"];
    const DescIcon = allIcons["IconFileText"];
    const SubtaskIcon = allIcons["IconSubtask"];

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
                boxShadow: 0,
                border: '1px solid',
                borderColor: isDragging ? theme.palette.primary.main : (theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800]),
                transform: isDragging ? 'rotate(2deg)' : null,
                // borderColor: "transparent",
                '&:hover': {
                    borderColor: theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600]
                }
            }}
        >


            <Box
                sx={{
                    p: 2,
                    px: 4,
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
                            {task?.labels?.map((l) => (
                                <CustomLabel key={l.id} label={l} />
                            ))}

                        </Stack>
                        <CardKanbanMenu task={task} />
                    </Stack>
                }

                <Stack direction="row" spacing={2} alignItems='center'>
                    {/* <IconButton size="small"> */}
                    <Box
                        sx={{
                            cursor: 'pointer'
                        }}
                    >
                        {task?.isCompleted ? <FilledCheckCircleIcon color={theme.palette.success.main} /> : <DashedOutlinedCheckCircleIcon color={theme.palette.text.secondary} />}
                    </Box>
                    {/* </IconButton> */}
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
                        <CustomTaskType taskType={task?.taskType} changeable={false} displayTextOnHoverOnly={true} />
                    </Box>
                    <Typography variant='body2' fontWeight='bold' noWrap flexGrow={1}>
                        {task?.name}
                    </Typography>
                    {task?.labels?.length <= 0 &&
                        <CardKanbanMenu task={task} />
                    }
                </Stack>
            </Box>


            {/* <Typography variant='body2' color={theme.palette.text.secondary} noWrap>
                    Test desciption a akjn al la a a las la va
                </Typography> */}
            <Divider sx={{ my: 1 }} />

            <Box
                sx={{
                    px: 4,
                    py: 2,
                }}
            >
                <CustomStatus status={task?.status} changeable={false} />

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
                    {task?.priority && (
                        <FieldBoxForKanbanCard px={2} py={0.5}
                            sx={{
                                bgcolor: task?.priority?.customization?.backgroundColor
                            }}
                        >
                            <Tooltip title="Priority" placement="top">
                                <Stack direction='row' alignItems='center' spacing={1}>
                                    <PriorityIcon color={theme.palette.getContrastText(task?.priority?.customization?.backgroundColor)} size={16} />
                                    <Typography color={theme.palette.getContrastText(task?.priority?.customization?.backgroundColor)} variant='body2'>
                                        {task?.priority?.name}
                                    </Typography>
                                </Stack>
                            </Tooltip>
                        </FieldBoxForKanbanCard>
                    )}

                    {task?.description && (
                        <Tooltip title={"Description"} placement="top">
                            <DescIcon stroke={2} size={20} color={theme.palette.text.secondary} />
                        </Tooltip>
                    )}

                    {task?.childTasks?.length > 0 && (
                        <Tooltip title={`${task?.childTasks?.length} subtask${task?.childTasks?.length > 1 ? 's' : ''}`} placement="top">
                            <SubtaskIcon stroke={2} size={20} color={theme.palette.text.secondary} />
                        </Tooltip>
                    )}

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
                        <Tooltip title={task?.assignee ? task?.assignee?.user?.lastName : "Unassigned"} placement="top">
                            {task?.assignee ? (
                                <Box>
                                    <CustomMember
                                        member={task?.assignee}
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
            </Box>
        </Card >
    );
}



export default CardKanban;