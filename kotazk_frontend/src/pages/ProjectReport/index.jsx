import { Box, Card, Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomLinechart from './Linechart';
import * as apiService from '../../api/index'
import { useSelector } from 'react-redux';
import CustomBarchart from './CustomBarchart';
import CustomStackedBar from './CustomStackedBar';

const ProjectReport = () => {

    const [projectReports, setProjectReports] = useState([]);
    const section = useSelector((state) => state.section.currentSection);

    useEffect(() => {
        if (section)
            fetchProjectReport();
    }, [section])

    const fetchProjectReport = async () => {
        const data = {
            "sortBy": "position",
            "sortDirectionAsc": true,
            "filters": []
        }

        const response = await apiService.projectReport.getPageBySection(section?.id, data)
        if (response?.data)
            setProjectReports(response?.data?.content);
    }

    return (
        <Grid2 container spacing={2} width={'100%'} height={"100%"}>
            {projectReports.map((pr, index) => (
                <Grid2 key={index} item size={4}>
                    <Card
                        sx={{
                            width: '100%',
                            // aspectRatio: '1.615/1',
                            height: '100%',
                            maxHeight: 500
                        }}
                    >
                        <Box px={4} pt={4}>
                            <Typography variant='h6' fontWeight={650}>
                                {pr.name}
                            </Typography>
                        </Box>
                        <Box
                            width={'100%'}
                            height={'100%'}
                            maxHeight={300}
                            p={4}
                            // pb={8}
                        >
                            {pr.type == "BAR_CHART" && (
                                <CustomBarchart chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                            )}
                            {pr.type == "STACKED_BAR" && (
                                <CustomStackedBar chartData={pr.items} chartNamesAndColors={pr.colorsAndNames} xType={pr.xtype} yType={pr.ytype} />
                            )}
                        </Box>
                    </Card>
                </Grid2>
            ))}



            {/* <Grid2 item size={3}>
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
            </Grid2> */}
        </Grid2>
    );
};


export default ProjectReport;
