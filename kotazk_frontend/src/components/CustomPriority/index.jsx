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
                backgroundColor: priority?.customization?.backgroundColor,
                py: 1,
                px: 2
            }}
        >
            <Typography
                variant='body2'
                color={theme.palette.getContrastText(priority?.customization?.backgroundColor)}
            >
                {priority?.name}
            </Typography>
        </Box>
    )
}

export default CustomPriority;