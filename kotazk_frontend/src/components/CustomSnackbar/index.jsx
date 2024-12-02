import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { Slide } from '@mui/material';

export default function CustomSnackbar() {
    const dispatch = useDispatch();
    const { open, content, type } = useSelector((state) => state.snackbar.snackbar);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setSnackbar({ open: false }));
    };

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={open}
            autoHideDuration={6000}
            TransitionComponent={(props) => <Slide {...props} direction="up" />}
            onClose={handleClose}
            message={content}
            action={action}
        />
    );
}
