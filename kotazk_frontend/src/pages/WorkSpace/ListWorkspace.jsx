import { Avatar, Box, Card, CardContent, CardHeader, Chip, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { IconVectorBezier2 } from "@tabler/icons-react";

const ListWorkspace = () => {
    const theme = useTheme();
    return (
        <Box>
            <Typography
                variant="h6"
                fontWeight={650}
                my={2}
            >
                List of projects
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={2}>

                    <Card>
                        <CardHeader
                            sx={{
                                p: 2,
                                bgcolor: '#D0706D'
                            }}
                        />
                        <CardContent>
                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={2}
                            >
                                <Box
                                    bgcolor='#D0706D'
                                    p={1}
                                    borderRadius={2}
                                >
                                    <IconVectorBezier2 size={20}/>
                                </Box>
                                <Typography
                                    variant="body1"
                                    fontWeight={650}
                                >
                                    Project name
                                </Typography>
                            </Stack>

                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={2}
                                mt={2}
                            >
                                <Avatar
                                    sx={{
                                        width: 25,
                                        height: 25
                                    }}
                                >
                                    H
                                </Avatar>
                                <Typography
                                    variant="body2"
                                >
                                    Nguyen Hung Khang
                                </Typography>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={2}
                                mt={2}
                            >
                                <Typography
                                    variant="body2"
                                    flexGrow={1}
                                    color={theme.palette.text.secondary}
                                >
                                    Open task
                                </Typography>
                                <Chip label="0" size="small" />
                            </Stack>

                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={2}
                                mt={2}
                            >
                                <Typography
                                    variant="body2"
                                    flexGrow={1}
                                    color={theme.palette.text.secondary}
                                >
                                    Done task
                                </Typography>
                                <Chip label="0" size="small" />
                            </Stack>
                            {/* Owner */}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ListWorkspace;