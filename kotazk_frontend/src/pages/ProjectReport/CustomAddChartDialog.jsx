import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box, Divider, Grid2, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import * as apiService from '../../api/index'
import * as TablerIcons from '@tabler/icons-react'
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { updateProjectReport } from '../../redux/actions/projectReport.action';
import CustomBarchart from './CustomBarchart';
import CustomStackedBar from './CustomStackedBar';
import CustomGroupeddBar from './CustomGroupedBar';
import CustomLinechart from './CustomLinechart';
import CustomPiechart from './CustomPiechart';
import { getCustomTwoModeColor, getSecondBackgroundColor } from '../../utils/themeUtil';

const chartTypeData1 = [
    { label: "Bar chart", id: "BAR_CHART" },
    { label: "Grouped bar chart", id: "GROUPED_BAR" },
    { label: "Stacked bar chart", id: "STACKED_BAR" },
    { label: "Line chart", id: "LINE" },
    { label: "Pie chart", id: "PIE" },
]

const xTypeData1 = [
    { label: "Status", id: "STATUS" },
    { label: "Task type", id: "TASK_TYPE" },
    { label: "Priority", id: "PRIORITY" },
]

const yTypeData1 = [
    { label: "Task count", id: "TASK_COUNT" },
    { label: "Time estimate", id: "TIME_ESTIMATE" }
]

const groupTypeData1 = [
    { label: "Status", id: "STATUS" },
    { label: "Task type", id: "TASK_TYPE" },
    { label: "Priority", id: "PRIORITY" },
]

export default function CustomAddChartDialog() {
    const [open, setOpen] = React.useState(false);
    const [xTypeData, setXTypeData] = React.useState([]);
    const [yTypeData, setYTypeData] = React.useState([]);
    const [groupTypeData, setGroupTypeData] = React.useState([]);
    const [type, setType] = React.useState(null);
    const [xType, setXType] = React.useState(null);
    const [yType, setYType] = React.useState(null);
    const [groupType, setGroupType] = React.useState(null);
    const [name, setName] = React.useState(null);
    const [previewChart, setPreviewChart] = React.useState(null);
    const section = useSelector((state) => state.section.currentSection);
    const dispatch = useDispatch();
    const theme = useTheme();
    const NoPreviewIcon = TablerIcons["IconGraphOff"];


    React.useEffect(() => {
        setChartDetail();
    }, [type])

    React.useEffect(() => {
        handlePreview();
    }, [type, xType, yType, groupType])

    const setChartDetail = () => {
        if (type == null) {
            setXTypeData([]);
            setYTypeData([]);
            setGroupTypeData([]);
        } else {
            switch (type.id) {
                case "BAR_CHART":
                case "LINE":
                case "PIE":
                    setXTypeData(xTypeData1);
                    setYTypeData(yTypeData1);
                    setGroupTypeData([]);
                    break;
                case "GROUPED_BAR":
                case "STACKED_BAR":
                    setXTypeData(xTypeData1);
                    setYTypeData(yTypeData1);
                    setGroupTypeData(groupTypeData1);
                    break;
                default:
                    break;
            }
        }
    }

    const handleSave = async () => {
        if (section?.id == null) {
            dispatch(setSnackbar({
                content: "Project report create failure!",
                open: true
            }))
            return;
        }

        if (name == null || name?.trim() == "") {
            dispatch(setSnackbar({
                content: "Please fill report name",
                open: true
            }))
            return;
        }

        if (name == null || name?.trim() == "") {
            dispatch(setSnackbar({
                content: "Please fill chart name",
                open: true
            }))
            return;
        }

        if (type == null) {
            dispatch(setSnackbar({
                content: "Please select chart type",
                open: true
            }))
            return;
        }

        if (type == null) {
            dispatch(setSnackbar({
                content: "Please select chart type",
                open: true
            }))
            return;
        }

        if (xTypeData?.length > 0 && xType == null) {
            dispatch(setSnackbar({
                content: "Please select X Axis",
                open: true
            }))
            return;
        }

        if (yTypeData?.length > 0 && yType == null) {
            dispatch(setSnackbar({
                content: "Please select Y Axis",
                open: true
            }))
            return;
        }

        if (groupTypeData?.length > 0 && groupType == null) {
            dispatch(setSnackbar({
                content: "Please select grouped X Axis",
                open: true
            }))
            return;
        }


        const data = {
            "sectionId": section?.id,
            "colorMode": "X_COLOR",
            "name": name,
            "type": type.id,
            "xType": xType?.id,
            "yType": yType?.id,
            "groupedBy": groupType?.id
        }

        const response = await apiService.projectReport.create(data);
        if (response?.data) {
            dispatch(updateProjectReport(response?.data))
            dispatch(setSnackbar({
                content: "Project report create successful!",
                open: true
            }))
        }
        setOpen(false);

    }

    const handlePreview = async () => {
        if (section?.id == null) {
            return;
        }

        if (type == null) {
            return;
        }

        if (type?.id == "BAR_CHART" || type?.id == "LINE" || type?.id == "PIE")
            if (xType == null || yType == null) {
                setPreviewChart(null);
                return;
            }


        if (type?.id == "GROUPED_BAR" || type?.id == "STACKED_BAR")
            if (xType == null || yType == null || groupType == null) {
                setPreviewChart(null);
                return;
            }
        const data = {
            "sectionId": section?.id,
            "type": type.id,
            "xType": xType?.id,
            "yType": yType?.id,
            "groupedBy": groupType?.id
        }
        const response = await apiService.projectReport.getPreviewChart(data);
        if (response?.data) {
            setPreviewChart(response?.data);
        }
    }


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button size='small' variant="contained" onClick={handleClickOpen}>
                Add report
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                PaperProps={{
                    sx: {
                        maxWidth: 1300
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title"
                    sx={{
                        bgcolor: getCustomTwoModeColor(theme, "#fff", "#1e1e1e")
                    }}
                >
                    Add New Report
                </DialogTitle>
                <DialogContent
                    sx={{
                        bgcolor: getCustomTwoModeColor(theme, "#fff", "#1e1e1e")
                    }}
                >
                    <Grid2 container spacing={2}>
                        <Grid2 item size={8}>
                            <Box
                                p={2}
                                borderRadius={2}
                                bgcolor={getSecondBackgroundColor(theme)}
                                width={800}
                                height={600}
                            >
                                <Box
                                    width={'100%'}
                                    height={'100%'}
                                    // borderColor={}
                                    bgcolor={getCustomTwoModeColor(theme, "#fff", "#1e1e1e")}
                                >
                                    {previewChart?.type == "BAR_CHART" && (
                                        <CustomBarchart chartData={previewChart?.items} chartNamesAndColors={previewChart?.colorsAndNames} xType={previewChart?.xtype} yType={previewChart?.ytype} />
                                    )}
                                    {previewChart?.type == "STACKED_BAR" && (
                                        <CustomStackedBar chartData={previewChart?.items} chartNamesAndColors={previewChart?.colorsAndNames} xType={previewChart?.xtype} yType={previewChart?.ytype} />
                                    )}
                                    {previewChart?.type == "LINE" && (
                                        <CustomLinechart chartData={previewChart?.items} chartNamesAndColors={previewChart?.colorsAndNames} xType={previewChart?.xtype} yType={previewChart?.ytype} />
                                    )}
                                    {previewChart?.type == "GROUPED_BAR" && (
                                        <CustomGroupeddBar chartData={previewChart?.items} chartNamesAndColors={previewChart?.colorsAndNames} xType={previewChart?.xtype} yType={previewChart?.ytype} />
                                    )}
                                    {previewChart?.type == "PIE" && (
                                        <CustomPiechart chartData={previewChart?.items} chartNamesAndColors={previewChart?.colorsAndNames} xType={previewChart?.xtype} yType={previewChart?.ytype} />
                                    )}
                                    {previewChart == null && (
                                        <Box width={'100%'}
                                            height={'100%'}
                                            display='flex'
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                        >
                                            <NoPreviewIcon size={300} stroke={1} color={getSecondBackgroundColor(theme)} />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Grid2>

                        <Grid2 item size={4}>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography>Chart name</Typography>
                                    <TextField
                                        size='small'
                                        placeholder='Enter report name'
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Box>

                                <Box>
                                    <Typography>Chart type</Typography>
                                    <Autocomplete
                                        value={type}
                                        onChange={(event, newValue) => {
                                            setType(newValue);
                                        }}
                                        size='small'
                                        disablePortal
                                        options={chartTypeData1}
                                        renderInput={(params) => <TextField {...params} size='small' placeholder='Select chart type' />}
                                    />
                                </Box>

                                <Divider flexItem
                                    sx={{
                                        my: 2
                                    }}
                                />

                                {xTypeData.length > 0 && (
                                    <Box>
                                        <Typography>X Axis</Typography>
                                        <Autocomplete
                                            value={xType}
                                            fullWidth
                                            onChange={(event, newValue) => {
                                                setXType(newValue);
                                            }}
                                            size='small'
                                            disablePortal
                                            options={xTypeData}
                                            renderInput={(params) => <TextField {...params} size='small' placeholder='Select chart type' />}
                                        />
                                    </Box>
                                )}

                                {groupTypeData.length > 0 && (
                                    <Box>
                                        <Typography>Grouped By</Typography>
                                        <Autocomplete
                                            value={groupType}
                                            fullWidth
                                            onChange={(event, newValue) => {
                                                setGroupType(newValue);
                                            }}
                                            size='small'
                                            disablePortal
                                            options={groupTypeData}
                                            renderInput={(params) => <TextField {...params} size='small' placeholder='Select chart type' />}
                                        />
                                    </Box>
                                )}

                                {yTypeData.length > 0 && (
                                    <Box>
                                        <Typography>Y Axis</Typography>
                                        <Autocomplete
                                            value={yType}
                                            fullWidth
                                            onChange={(event, newValue) => {
                                                setYType(newValue);
                                            }}
                                            size='small'
                                            disablePortal
                                            options={yTypeData}
                                            renderInput={(params) => <TextField {...params} size='small' placeholder='Select chart type' />}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </Grid2>
                    </Grid2>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleSave} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
