import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

const CustomLabel = ({ label, alwaysShowLabel = false }) => {
    const theme = useTheme();
    const showLabel = useSelector((state) => state.label.showLabel);
    
    return (
        <Box
            bgcolor={label?.customization?.backgroundColor || "#0d9af2"}
            borderRadius={1}
            height={alwaysShowLabel || showLabel ? 'auto' : 8 }
            width={alwaysShowLabel || showLabel ? 'auto' : 50 }
            sx={{
                transition: 'height 0.3s ease, width 0.3s ease', // Animate height and width
                display: 'flex', // Ensures proper alignment when collapsed
                alignItems: 'center',
                overflow: 'hidden', // Hide content when collapsed
            }}
        >
            {(alwaysShowLabel || showLabel) && (
                <Typography
                    sx={{
                        mx: 2
                    }}
                    color={theme.palette.getContrastText(label?.customization?.backgroundColor || "#0d9af2")}
                >
                    {label?.name}
                </Typography>
            )}
        </Box>
    );
};

export default CustomLabel;
