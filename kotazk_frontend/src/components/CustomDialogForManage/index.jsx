import { Box, Slide } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


export default function CustomDialogForManage({ children, open, setOpen, customMaxWidth }) {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState("lg");

    React.useEffect(() => {
        if (customMaxWidth)
            setMaxWidth(setMaxWidth);
    }, [customMaxWidth])

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            hideBackdrop={false}
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={{
                elevation: 0,
                sx: {
                    bgcolor: 'transparent !important',
                    position: 'fixed',
                    top: 100,
                    margin: 0,  // Remove any margin
                    maxWidth: 800,
                    padding: 0,  // Remove any padding
                    borderRadius: 0,  // Remove border-radius to make it flush with edges
                    transform: 'none',  // Prevent default MUI positioning transform
                }
            }}
        >
            <Box
            >
                {React.isValidElement(children) ?
                    React.cloneElement(children, { handleClose: handleClose, isDialog: true })
                    :
                    children}
            </Box>
        </Dialog>
    );
}
