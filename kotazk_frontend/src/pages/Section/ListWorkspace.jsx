import { Avatar, Box, Card, CardContent, CardHeader, Chip, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { IconVectorBezier2 } from "@tabler/icons-react";

const ListWorkspace = () => {
    const theme = useTheme();

    return (
        <Box>
            <Typography variant="h6" fontWeight={650} my={2}>
                Recently Viewed
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={2}
                            >
                                <Avatar sx={{ bgcolor: '#D0706D' }}>
                                    <IconVectorBezier2 size={20} />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight={650}>
                                        Project name
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Nguyen Hung Khang
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Repeat Grid item for other recently viewed items */}
            </Grid>

            <Typography variant="h6" fontWeight={650} my={2}>
                My Workspaces
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Workspace Name"
                            subheader="Owner: Nguyen Hung Khang"
                            action={
                                <Stack direction="row" spacing={1}>
                                    <Chip label="Open: 5" size="small" />
                                    <Chip label="Done: 10" size="small" />
                                </Stack>
                            }
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Additional details about the workspace...
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Repeat Grid item for other workspaces */}
            </Grid>
        </Box>
    );
}

export default ListWorkspace;
