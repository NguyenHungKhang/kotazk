import { Box, Stack, Typography, useTheme } from "@mui/material"
import { statusIconsList } from "../../utils/iconsListUtil"
import CustomColorIconPicker from "../CustomColorIconPicker"
import { useState } from "react"

const CustomStatus = ({ status, changeable }) => {
    const theme = useTheme();
    const [customization, setCustomization] = useState({});
    return (
        <Box>
            <Stack direction='row' spacing={2} alignItems='center' pr={2}>
                <CustomColorIconPicker changeable={changeable} icons={statusIconsList} customization={status?.customization} />
                <Typography
                    variant="body1"
                    fontWeight={500}
                >
                    {status?.name}
                </Typography>
            </Stack>
        </Box>
    )
}

export default CustomStatus;