import { Avatar, Box, Card, CardContent, Chip, Divider, Stack, Typography, lighten, useTheme } from "@mui/material";
import * as allIcons from "@tabler/icons-react"
import { useState } from "react";
import CustomTaskDialog from "../../components/CustomTaskDialog";
import { useDispatch } from "react-redux";
import { setTaskDialog } from "../../redux/actions/dialog.action";
import dayjs from "dayjs";
import CustomStatus from "../../components/CustomStatus";
import { useSelector } from "react-redux";

const CardKanban = ({ task, isDragging }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [displayLabels, setDisplayLabels] = useState(false);
    const CalendarIcon = allIcons["IconCalendar"];
    const TimeIcon = allIcons["IconClock2"];
    const AttachmentIcon = allIcons["IconPaperclip"];
    const CommentIcon = allIcons["IconMessageDots"];

    const openTaskDialog = () => {
        const taskDialogData = {
            task: task,
            open: true
        }
        console.log(taskDialogData);
        dispatch(setTaskDialog(taskDialogData));
    }

    return (
        <Card
            onClick={openTaskDialog}
            sx={{
                // bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#22272B",
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
                <Stack
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
                        setDisplayLabels(!displayLabels);
                    }}
                >
                    <Box
                        bgcolor='#E5826F'
                        borderRadius={1}
                        height={!displayLabels ? 8 : 'auto'}
                        width={!displayLabels ? 50 : 'auto'}
                    >
                        {displayLabels && (
                            <Typography
                                sx={{
                                    mx: 2
                                }}
                                color={theme.palette.getContrastText("#E5826F")}
                            >
                                Test Label
                            </Typography>
                        )}
                    </Box>
                </Stack>
                <Typography variant='body2' fontWeight='bold' noWrap>
                    {task?.name}
                </Typography>
                {/* <Typography variant='body2' color={theme.palette.text.secondary} noWrap>
                    Test desciption a akjn al la a a las la va
                </Typography> */}
                <Divider sx={{ my: 2 }} />
                <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap
                    sx={{
                        mt: 2
                    }}
                >
                    {
                        task?.endAt &&
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <CalendarIcon color={theme.palette.text.secondary} size={16} />
                            <Typography color={theme.palette.text.secondary} variant='body2'>
                                {dayjs(task?.endAt).format("HH:mm MM/DD/YYYY")}
                            </Typography>
                        </Stack>
                    }
                    {/* <Stack direction='row' alignItems='center' spacing={1}>
                        <TimeIcon color={theme.palette.text.secondary} size={16} />
                        <Typography color={theme.palette.text.secondary} variant='body2'>
                            12:00 AM
                        </Typography>
                    </Stack> */}

                    <Stack direction='row' alignItems='center' spacing={1}>
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
                    </Stack>
                    <Avatar
                        sx={{
                            marginLeft: 'auto',
                            width: 24,
                            height: 24,
                            fontSize: 16
                        }}
                    >
                        H
                    </Avatar>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default CardKanban;