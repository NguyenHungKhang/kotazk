import { Avatar, Box, Typography, useTheme } from "@mui/material";

const CustomMember = ({ member, isShowName = false }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: 'flex',
                width: 'fit-content',
                alignItems: 'center',
                borderRadius: isShowName ? 2 : 4,
                backgroundColor:  theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                px: isShowName && 2,
                py: isShowName && 1
            }}
        >
            <Avatar 
            alt={member?.user?.lastName} 
            src={member?.user?.avatar != null ? member?.user?.avatar : member?.user?.lastName} 
            sx={{ 
                width: 24, 
                height: 24, 
                fontSize: 14, 
                fontWeight: 500, 
                bgcolor: theme.palette.primary.main, 
                color: theme.palette.getContrastText(theme.palette.primary.main) }} />
            {isShowName && <Typography variant='body1' ml={1}>{member?.user?.lastName}</Typography> }
        </Box>
    );
}

export default CustomMember;