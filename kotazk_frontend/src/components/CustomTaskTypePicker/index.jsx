import { Box, Button } from "@mui/material";
import CustomPickerSingleObjectDialog from "../CustomPickerSingleObjectDialog";

const CustomTaskTypePicker = () => {
    return (
        <Box>
            <CustomPickerSingleObjectDialog OpenComponent={TempButton} />
        </Box>
    );
}

const TempButton = ({ action }) => {
    return (
        <Button onClick={action}>
            Open
        </Button>
    )
}

export default CustomTaskTypePicker;