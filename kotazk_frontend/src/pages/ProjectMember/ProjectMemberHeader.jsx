import { Box, Button, Card, Divider, FormControl, Paper, Select, Stack, TextField, Typography, MenuItem, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import * as allIcons from '@tabler/icons-react'
import { useState } from "react";

const ProjectMemberHeader = () => {
    const theme = useTheme();
    const FilterIcon = allIcons['IconAccessible'];
    const MemberTagIcon = allIcons['IconTags'];
    const [viewType, setViewType] = useState('ACTIVE');

    const handleChangeViewType = (event) => {
        setViewType(event.target.value);
    };

    return (
        <Box>
            <Stack
                direction='row'
                spacing={2}
                sx={{
                    mb: 2
                }}
                alignItems='center'
            >
                <Box flexGrow={1}>
                    <Typography variant="h4" fontWeight={650}>
                        Project member
                    </Typography>
                </Box>
                <Box>
                    <FormControl size="small">
                        <Select
                            size="small"
                            // defaultValue='ACTIVE'
                            value={viewType}
                            onChange={handleChangeViewType}
                        >
                            <MenuItem value='ACTIVE'>Active</MenuItem>
                            <MenuItem value='PENDING'>Pending</MenuItem>
                            <MenuItem value='BANNED'>Banned</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button
                    variant="outlined"
                    size="small"
                    color={theme.palette.mode === 'light' ? 'customBlack' : 'customWhite'}
                    sx={{
                        textTransform: 'none'
                    }}
                    startIcon={
                        <MemberTagIcon size={16} />
                    }
                >
                    Member tag
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    color={theme.palette.mode === 'light' ? 'customBlack' : 'customWhite'}
                    sx={{
                        textTransform: 'none'
                    }}
                    startIcon={
                        <FilterIcon size={16} />
                    }
                >
                    Role
                </Button>
                <Box>
                    <TextField
                        placeholder="Search..."
                        size="small"
                    />
                </Box>
                <Button
                    color="success"
                    variant="contained"
                    size="small"
                    sx={{
                        textTransform: 'none'
                    }}
                >
                    Add member
                </Button>
            </Stack>
            <Stack direction='row' spacing={2}>
                <Box
                    bgcolor={getSecondBackgroundColor(theme)}
                    borderRadius={2}
                    width='100%'
                    sx={{
                        p: 4
                    }}
                >
                    <Typography textAlign='center' variant="h2">
                        1
                    </Typography>
                    <Typography textAlign='center' variant="h5">Total Members</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box
                    bgcolor={getSecondBackgroundColor(theme)}
                    borderRadius={2}
                    width='100%'
                    sx={{
                        p: 4
                    }}
                >
                    <Typography textAlign='center' variant="h2">
                        1
                    </Typography>
                    <Typography textAlign='center' variant="h5">Searching Members</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box
                    bgcolor={getSecondBackgroundColor(theme)}
                    borderRadius={2}
                    width='100%'
                    sx={{
                        p: 4
                    }}
                >
                    <Typography textAlign='center' variant="h2">
                        0
                    </Typography>
                    <Typography textAlign='center' variant="h5">Pending Requests</Typography>
                </Box>
            </Stack>
        </Box>
    );
}

export default ProjectMemberHeader;