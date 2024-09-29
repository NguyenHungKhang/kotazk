import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setDeleteDialog } from '../../redux/actions/dialog.action';
import * as apiService from '../../api/index'
import { setCurrentTaskList } from '../../redux/actions/task.action';
import { setSnackbar } from '../../redux/actions/snackbar.action';
import { setCurrentStatusList } from '../../redux/actions/status.action';


export default function CustomDeleteDialog({ deleteAction }) {
    const dispatch = useDispatch();
    const { title, content, open, deleteType, deleteProps } = useSelector((state) => state.dialog.deleteDialog);
    const tasks = useSelector((state) => state.task.currentTaskList)
    const statuses = useSelector((state) => state.status.currentStatusList)

    const handleClose = () => {
        dispatch(setDeleteDialog({ open: false }));
    };

    const handleDeleteAction = async () => {
        if (deleteType == "DELETE_TASK" && deleteProps != null) {
            const taskId = deleteProps.taskId;
            await handleDelete(taskId)
        } else  if (deleteType == "DELETE_STATUS" && deleteProps != null) {
            const statusId = deleteProps.statusId;
            await handleDeleteStatus(statusId)
        }
        dispatch(setDeleteDialog({ open: false }));
    }


    const handleDelete = async (taskId) => {
        try {
            const response = await apiService.taskAPI.remove(taskId)
            if (response?.data) {
                dispatch(setCurrentTaskList(tasks.filter(t => t.id != taskId)));
                dispatch(setSnackbar({
                    content: "Task deleted successful!",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }

    }

    
    const handleDeleteStatus = async (statusId) => {
        try {
            const response = await apiService.statusAPI.remove(statusId)
            if (response?.data) {
                dispatch(setCurrentStatusList(statuses.filter(s => s.id != statusId)));
                dispatch(setSnackbar({
                    content: "Task deleted successful!",
                    open: true
                }))
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }

    }


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <p dangerouslySetInnerHTML={{ __html: content }}></p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteAction} variant='contained' color='error'>Delete</Button>
                <Button onClick={handleClose} autoFocus variant='outlined' color='error'>
                    Cancle
                </Button>
            </DialogActions>
        </Dialog>
    );
}
