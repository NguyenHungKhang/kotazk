import { Avatar, Box, Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";
import * as allIcons from "@tabler/icons-react"
import { useState } from "react";

const CardKanban = () => {
    const theme = useTheme();
    const [displayLabels, setDisplayLabels] = useState(false);

    const CalendarIcon = allIcons["IconCalendar"];
    const TimeIcon = allIcons["IconClock2"];
    const AttachmentIcon = allIcons["IconPaperclip"];
    const CommentIcon = allIcons["IconMessageDots"];

    return (
        <Card>
            <CardContent
                sx={{
                    p: 4
                }}
            >
                <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap mb={2}>
                    <Box
                        bgcolor='#E5826F'
                        borderRadius={1}
                        height={!displayLabels ? 8 : 'auto'}
                        width={!displayLabels ? 50 : 'auto'}
                        onClick={() => setDisplayLabels(!displayLabels)}
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
                    Task name 1231415412412414124124124
                </Typography>
                {/* <Typography variant='body2' color={theme.palette.text.secondary} noWrap>
                    Test desciption a akjn al la a a las la va
                </Typography> */}
                <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap
                    sx={{
                        mt: 2
                    }}
                >
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <CalendarIcon color={theme.palette.text.secondary} size={16} />
                        <Typography color={theme.palette.text.secondary} variant='body2'>
                            3/9/2024
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <TimeIcon color={theme.palette.text.secondary} size={16} />
                        <Typography color={theme.palette.text.secondary} variant='body2'>
                            12:00 AM
                        </Typography>
                    </Stack>

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