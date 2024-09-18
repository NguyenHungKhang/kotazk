import { Box, Stack, Typography } from "@mui/material"
import { taskTypeIconsList } from "../../utils/iconsListUtil"
import CustomColorIconPicker from "../CustomColorIconPicker"

const CustomTaskType = ({ taskType, changeable }) => {
    return (
        <Box>
            <Stack direction='row' spacing={2} alignItems='center'>
                <CustomColorIconPicker changeable={changeable} icons={taskTypeIconsList} />
                <Typography
                    variant="body1"
                    fontWeight={500}
                >
                    {taskType.name}
                </Typography>
            </Stack>
        </Box>
    )
}

export default CustomTaskType;