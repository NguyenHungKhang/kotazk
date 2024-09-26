import { Box, Stack, Typography, useTheme } from "@mui/material"
import { taskTypeIconsList } from "../../utils/iconsListUtil"
import CustomColorIconPicker from "../CustomColorIconPicker"

const CustomPriority = ({ priority, changeable }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                // backgroundColor: priority?.color,
                p: 1
            }}
        >
            <Typography
                variant='body2'
            // color={theme.palette.getContrastText(priority?.color)}
            >
                {priority?.name}
            </Typography>
        </Box>
    )
}

export default CustomPriority;