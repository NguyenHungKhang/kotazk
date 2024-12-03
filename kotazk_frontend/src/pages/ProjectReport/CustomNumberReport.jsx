import { Box, Paper, Stack, Typography } from "@mui/material";

const CustomNumberReport = ({ number, yType, isPreview = false }) => {
    return (
        <Stack height={'100%'} width={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Box
                sx={{
                    p: 4
                }}
            >
                {isPreview ?
                    <>
                        <Typography fontSize={80} fontWeight={650} textAlign={'center'}>
                            {number}
                        </Typography>
                        <Typography fontSize={30} textAlign={'center'} color="textSecondary">
                            {yType == "TASK_COUNT" ? "Task" : "Hour"}{number == 1 ? "" : "s"}
                        </Typography>
                    </>
                    :
                    <>
                        <Typography fontSize={60} fontWeight={650} textAlign={'center'}>
                            {number}
                        </Typography>
                        <Typography fontSize={20} textAlign={'center'} color="textSecondary">
                            {yType == "TASK_COUNT" ? "Task" : "Hour"}{number == 1 ? "" : "s"}
                        </Typography>
                    </>
                }
            </Box>
        </Stack>
    );
}

export default CustomNumberReport;