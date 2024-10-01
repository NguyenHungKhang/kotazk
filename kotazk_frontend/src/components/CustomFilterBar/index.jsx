import { Button, ButtonGroup, Stack, darken, useTheme } from "@mui/material";
import LayersIcon from '@mui/icons-material/Layers';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as allIcons from "@tabler/icons-react"
import { useDispatch } from "react-redux";
import { setAddTaskDialog } from "../../redux/actions/dialog.action";
import CustomFilterDialog from "../CustomFilterDialog";

const CustomFilterBar = () => {
    const theme = useTheme();

    return (
        <Stack direction='row' spacing={2}>
            <CustomFilterDialog />
            <Button
                sx={{
                    textTransform: 'none',
                }}
                color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                size="small"
                startIcon={<LayersIcon fontSize="small" />}
            >
                Group By
            </Button>
            <Button
                sx={{
                    textTransform: 'none',
                }}
                color={theme.palette.mode === 'light' ? "customBlack" : "customWhite"}
                size="small"
                startIcon={<UnfoldMoreIcon fontSize="small" />}
            >
                Sort
            </Button>
            <CustomAddTaskButton />
        </Stack>
    );
}

const CustomAddTaskButton = () => {
    const theme = useTheme();
    const AddIcon = allIcons["IconPlus"];
    const dispatch = useDispatch();

    const handleOpenAddTaskDialog = () => {
        dispatch(setAddTaskDialog({ open: true }))
    }

    return (

        <Button
            size='small'
            variant="contained"
            sx={{
                textTransform: 'none',
                background: 'linear-gradient(45deg, #FF3259 30%, #FF705A 90%)',
                color: '#FFFFFF',
                '&:hover': {
                    background: 'linear-gradient(45deg, #FF705A 30%, #FF3259 90%)',
                },
            }}
            startIcon={
                <AddIcon size={16} />
            }
            onClick={handleOpenAddTaskDialog}
        >
            Add task
        </Button>

    );
}

export default CustomFilterBar;
