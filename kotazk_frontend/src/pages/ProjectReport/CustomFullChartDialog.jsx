import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box, Divider, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import * as apiService from '../../api/index'
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import CustomBarchart from './CustomBarchart';
import CustomStackedBar from './CustomStackedBar';
import CustomGroupeddBar from './CustomGroupedBar';
import CustomLinechart from './CustomLinechart';
import CustomPiechart from './CustomPiechart';
import { setFullReportDialog } from '../../redux/actions/dialog.action';
import { getCustomTwoModeColor } from '../../utils/themeUtil';
import CustomNumberReport from './CustomNumberReport';

export default function CustomFullChartDialog({ }) {
    // const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const { open, props } = useSelector((state) => state.dialog.fullReportDialog);
    const theme = useTheme();

    const handleClose = () => {
        dispatch(setFullReportDialog({ open: false, props: null }))
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth
        >
            <DialogTitle id="alert-dialog-title"
                sx={{
                    bgcolor: getCustomTwoModeColor(theme, "#fff", "#1e1e1e")
                }}
            >
                {props?.name}
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{
                    bgcolor: getCustomTwoModeColor(theme, "#fff", "#1e1e1e")
                }}
            >

                <Box
                    width={props?.type == "NUMBER" ? 500 : 1000}
                    height={props?.type == "NUMBER" ? 300 :600}
                >
                    {props?.type == "BAR_CHART" && (
                        <CustomBarchart chartData={props?.chartData} chartNamesAndColors={props?.chartNamesAndColors} xType={props?.xType} yType={props?.yType} />
                    )}
                    {props?.type == "STACKED_BAR" && (
                        <CustomStackedBar chartData={props?.chartData} chartNamesAndColors={props?.chartNamesAndColors} xType={props?.xType} yType={props?.yType} />
                    )}
                    {props?.type == "LINE" && (
                        <CustomLinechart chartData={props?.chartData} chartNamesAndColors={props?.chartNamesAndColors} xType={props?.xType} yType={props?.yType} />
                    )}
                    {props?.type == "GROUPED_BAR" && (
                        <CustomGroupeddBar chartData={props?.chartData} chartNamesAndColors={props?.chartNamesAndColors} xType={props?.xType} yType={props?.yType} />
                    )}
                    {props?.type == "PIE" && (
                        <CustomPiechart chartData={props?.chartData} chartNamesAndColors={props?.chartNamesAndColors} xType={props?.xType} yType={props?.yType} />
                    )}
                    {props?.type == "NUMBER" && (
                        <CustomNumberReport number={props?.numberValue} yType={props?.yType} isPreview={true} />
                    )}
                </Box>
            </DialogContent>

        </Dialog>
    );
}
