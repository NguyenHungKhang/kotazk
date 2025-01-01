import { Avatar, Box, Button, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react"
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
import * as TablerIcons from "@tabler/icons-react"
import { CustomLongTextEditor } from "../CustomLongTextEditor";
import * as apiService from '../../api/index'
import dayjs from "dayjs";
import CommentItemDialog from "./CommentItemDialog";
import { useDispatch } from "react-redux";
import { setDeleteDialog } from "../../redux/actions/dialog.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import { addAndUpdateTaskCommentList, setCurrentTaskCommentList } from "../../redux/actions/taskComment.action";
import { useSelector } from "react-redux";
import { getAvatar } from "../../utils/avatarUtil";

const commentNumInLoad = 5;

const CommentComponent = ({ task }) => {
    const comments = useSelector((state) => state.taskComment.currentTaskCommentList);
    const theme = useTheme();
    const LoadMoreIcon = TablerIcons["IconRefresh"];
    const SendIcon = TablerIcons["IconSend2"];
    const [content, setContent] = useState(null);
    const [pagination, setPagination] = useState({
        hasNext: false,
        hasPrevious: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
    });
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const dispatch = useDispatch();

    useEffect(() => {
        if (task)
            commentsFetch()
    }, [task]);

    const commentsFetch = async () => {
        const data = {
            "pageSize": commentNumInLoad,
            "filters": []
        }

        const response = await apiService.taskComment.getPageByTask(task?.id, data);
        if (response?.data) {
            const { content, ...pagination } = response?.data;
            setPagination(pagination);
            dispatch(setCurrentTaskCommentList(content));
        }

    }

    const handlePagination = async () => {
        if (!pagination.hasNext) return;

        const data = {
            "pageNum": 0,
            "pageSize": pagination.pageSize + commentNumInLoad,
            "filters": []
        }

        const response = await apiService.taskComment.getPageByTask(task?.id, data);
        if (response?.data) {
            const { content, ...pagination } = response?.data;
            setPagination(pagination);
            dispatch(setCurrentTaskCommentList(content));
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && event.shiftKey) {
            // Insert a line break on Shift+Enter
            event.preventDefault(); // Prevent the default newline behavior
            setContent((prev) => prev + "\n");
        } else if (event.key === "Enter") {
            // Run a function on Enter
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (content == null || content?.trim() == '')
            return;

        const data = {
            "taskId": task?.id,
            "content": content
        }

        const response = await apiService.taskComment.create(data);
        if (response?.data) {
            dispatch(addAndUpdateTaskCommentList(response.data));
            setContent('');
        }
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: getSecondBackgroundColor(theme),
                    p: 2,
                    borderRadius: 2,
                }}
            >
                {pagination?.hasNext && (
                    <Button startIcon={<LoadMoreIcon size={18} />} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")} onClick={() => handlePagination()} fullWidth
                    sx={{
                        mb: 2
                    }}
                    >
                        Load more comments...
                    </Button>
                )}

                <Stack spacing={2}>
                    {(comments && comments?.length > 0) ? (
                        <>
                            {[...comments]?.reverse().map((comment) => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))}
                        </>
                    ) :
                        <Box width={'100%'} p={2}>
                            <Typography color='textSecondary'>
                                <i>No comments</i>
                            </Typography>
                        </Box>
                    }

                </Stack>

            </Box>
            {currentMember?.role?.projectPermissions.includes("ADD_COMMENT") && (
                <Box mt={2}
                    sx={{
                        bgcolor: getSecondBackgroundColor(theme),
                        p: 2,
                        borderRadius: 2,
                    }}
                >

                    <Stack direction={"row"} spacing={2} p={2} borderRadius={2} width={'100%'}>
                        <Box
                            pt={0.5}
                        >
                            <Avatar
                                sx={{
                                    height: 30,
                                    width: 30
                                }}
                                alt={currentMember?.user?.lastName}
                                src={getAvatar(currentMember?.user?.id, currentMember?.user?.avatar)}
                            />
                        </Box>
                        <Box flexGrow={1} bgcolor={theme.palette.background.default}>
                            <TextField
                                size="small"
                                multiline
                                maxRows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                fullWidth
                                placeholder="Enter comment..."
                                onKeyDown={handleKeyDown}
                                sx={{
                                    width: '100%',
                                }}
                            />
                        </Box>
                        <Box
                            pt={0.5}
                        >
                            <IconButton
                                size="small"
                                onClick={() => handleSubmit()}
                                sx={{
                                    bgcolor: theme.palette.background.default
                                }}
                            >
                                <SendIcon size={20} />
                            </IconButton>
                        </Box>
                    </Stack>
                </Box>
            )}

        </>
    );
}

const CommentItem = ({ comment }) => {
    const theme = useTheme();
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(null);
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const dispatch = useDispatch();

    useEffect(() => {
        if (comment)
            setContent(comment.content)
    }, [comment])

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && event.shiftKey) {
            // Insert a line break on Shift+Enter
            event.preventDefault(); // Prevent the default newline behavior
            setContent((prev) => prev + "\n");
        } else if (event.key === "Enter") {
            // Run a function on Enter
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (content == null || content?.trim() == '')
            return;

        const data = {
            "content": content
        }

        const response = await apiService.taskComment.update(comment?.id, data);
        if (response?.data) {
            dispatch(addAndUpdateTaskCommentList(response.data));
        }
        setEditing(false);
    };

    return (
        <Stack key={comment?.id} direction={"row"} spacing={2} width={'fit-content'}>
            <Box>
                <Avatar
                    sx={{
                        height: 30,
                        width: 30
                    }}
                    src={getAvatar(comment?.member?.user?.id, comment?.member?.user?.avatar)}
                />
            </Box>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Stack p={2} bgcolor={theme.palette.background.default} borderRadius={2}>
                    <Stack direction={'row'} spacing={2}>
                        <Typography fontWeight={650}>{comment.user.firstName} {comment.user.lastName}</Typography>
                        <Typography>-</Typography>
                        <Typography color={theme.palette.text.secondary}>{dayjs(comment.createdAt).format("HH:mm MM/DD/YYYY")}</Typography>
                    </Stack>
                    {editing ? (
                        <TextField
                            size="small"
                            multiline
                            focused
                            maxRows={4}
                            defaultValue={comment?.content}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            fullWidth
                            placeholder="Enter comment..."
                            onKeyDown={handleKeyDown}
                            sx={{
                                width: '100%',
                            }}
                            onBlur={() => {
                                setEditing(false);
                                setContent(comment?.content)
                            }}
                        />
                    ) : (
                        <Box sx={{ whiteSpace: 'pre-wrap' }}>{comment.content}</Box>
                    )}

                </Stack>
                <Box>
                    <CommentItemDialog setEditing={setEditing} comment={comment} />
                </Box>
            </Stack>
        </Stack>
    );
}

export default CommentComponent;