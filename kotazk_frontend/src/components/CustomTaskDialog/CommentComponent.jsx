import { Avatar, Box, Button, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react"
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
import * as TablerIcons from "@tabler/icons-react"
import { CustomLongTextEditor } from "../CustomLongTextEditor";

const CommentComponent = () => {
    const [comments, setCommets] = useState();
    const theme = useTheme();
    const LoadMoreIcon = TablerIcons["IconChevronsRight"];
    
    const [content, setContent] = useState();

    const handleSaveDesc = () => {
    }

    return (
        <>
            <Box
                sx={{
                    bgcolor: getSecondBackgroundColor(theme),
                    p: 2,
                    borderRadius: 2,
                }}
            >
                <Button endIcon={<LoadMoreIcon size={18} />} color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}>
                    Load more comment
                </Button>
                <Stack spacing={2} mt={2}>
                    <Stack direction={"row"} spacing={4} bgcolor={theme.palette.background.default} p={1} borderRadius={2} width={'fit-content'}>
                        <Box>
                            <Avatar />
                        </Box>
                        <Stack>
                            <Typography fontWeight={650}>Name</Typography>
                            <Typography>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment </Typography>
                        </Stack>


                    </Stack>
                    <Stack direction={"row"} spacing={4} bgcolor={theme.palette.background.default} p={2} borderRadius={2} width={'fit-content'}>
                        <Box>
                            <Avatar />
                        </Box>
                        <Stack>
                            <Typography fontWeight={650}>Name</Typography>
                            <Typography>Comment</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} spacing={4} bgcolor={theme.palette.background.default} p={1} borderRadius={2} width={'fit-content'}>
                        <Box>
                            <Avatar />
                        </Box>
                        <Stack>
                            <Typography fontWeight={650}>Name</Typography>
                            <Typography>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={"row"} spacing={4} bgcolor={theme.palette.background.default} p={1} borderRadius={2} width={'fit-content'}>
                        <Box>
                            <Avatar />
                        </Box>
                        <Stack>
                            <Typography fontWeight={650}>Name</Typography>
                            <Typography>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment </Typography>
                        </Stack>
                    </Stack>
                </Stack>

            </Box>
            <Box mt={2}
                sx={{
                    bgcolor: getSecondBackgroundColor(theme),
                    p: 2,
                    borderRadius: 2,
                }}
            >
                <Avatar />
                <Box>
                    <CustomLongTextEditor content={content} setContent={setContent} saveContent={handleSaveDesc} />
                </Box>
            </Box>
        </>
    );
}

export default CommentComponent;