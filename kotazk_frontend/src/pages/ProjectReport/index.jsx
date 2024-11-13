import { Card, Grid2 } from '@mui/material';
import React from 'react';
import CustomLinechart from './Linechart';

const ProjectReport = () => {
    return (
        <Grid2 container spacing={4} width={'100%'} height={"100%"}>
            <Grid2 item size={3}>
                <Card
                    sx={{
                        width: '100%',
                        aspectRatio: '1.615/1',
                        height: 'auto',
                    }}
                >
                    <CustomLinechart />
                </Card>
            </Grid2>
            <Grid2 item size={3}>
                <Card
                    sx={{
                        width: '100%',
                        aspectRatio: '1.615/1',
                        height: 'auto',
                    }}
                >
                    <CustomLinechart />
                </Card>
            </Grid2>
            <Grid2 item size={6}>
                <Card
                    sx={{
                        width: '100%',
                        aspectRatio: '1.615/1',
                        height: 'auto',
                    }}
                >
                    <CustomLinechart />
                </Card>
            </Grid2>
            <Grid2 item size={3}>
                <Card
                    sx={{
                        width: '100%',
                        aspectRatio: '1.615/1',
                        height: 'auto',
                    }}
                >
                    <CustomLinechart />
                </Card>
            </Grid2>
        </Grid2>
    );
};


export default ProjectReport;
