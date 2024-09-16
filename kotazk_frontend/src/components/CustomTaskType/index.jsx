import { Box, Stack, Typography } from "@mui/material"
import { taskTypeIconsList } from "../../utils/iconsListUtil"
import CustomColorIconPicker from "../CustomColorIconPicker"

const CustomTaskType = () => {
    return (
        <Box>
            <Stack direction='row' spacing={2} alignItems='center'>
                <CustomColorIconPicker changeable={true} icons={taskTypeIconsList} />
                <Typography
                    variant="body1"
                    fontWeight={500}
                >
                    Test task Type
                </Typography>
            </Stack>
        </Box>
    )
}

export default CustomTaskType;