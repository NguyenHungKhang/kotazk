import * as React from 'react';
import * as TablerIcons from '@tabler/icons-react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAlertDialog } from '../../redux/actions/dialog.action';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CustomAlertDialog() {
    const theme = useTheme();
    const navigate = useNavigate();
    const ErrorIcon = TablerIcons["IconExclamationCircleFilled"];
    const { open, props, type } = useSelector((state) => state.dialog.alertDialog);
    const dispatch = useDispatch();

    const handleClose = () => {
        if (props?.actionUrl) navigate(props?.actionUrl)
        dispatch(setAlertDialog({
            open: false,
        }))
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                bgcolor: type == "error" && theme.palette.background.default,
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {props?.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div dangerouslySetInnerHTML={{ __html: props?.content }} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='contained' autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
