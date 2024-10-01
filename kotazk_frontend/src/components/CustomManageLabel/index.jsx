import { Box, Button, Card, Checkbox, Grid, IconButton, Stack, TextField, ToggleButton, Typography, useTheme } from "@mui/material";
import { getSecondBackgroundColor } from "../../utils/themeUtil";
import { useSelector } from "react-redux";
import CustomLabel from '../CustomLabel/index';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useRef, useState } from 'react';
import * as TablerIcons from '@tabler/icons-react'
import { labelIconsList } from "../../utils/iconsListUtil";
import CustomBasicTextField from "../CustomBasicTextField";
import CustomColorIconPicker from "../CustomColorIconPicker";
import * as apiService from '../../api/index'
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../redux/actions/snackbar.action";
import { setCurrentLabelList } from "../../redux/actions/label.action";
import { updateAndAddArray } from "../../utils/arrayUtil";
import { setDeleteDialog } from "../../redux/actions/dialog.action";
import CustomColorPicker from "../CustomColorPicker";
import CustomColorPickerDialog from "../CustomColorPicker/CustomColorPickerDialog";

const CustomManageLabel = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const labels = useSelector((state) => state.label.currentLabelList);
    const project = useSelector((state) => state.project.currentProject)
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [openAddLabel, setOpenAddLabel] = useState(false);
    const [items, setItems] = useState(labels);
    const DragIcon = TablerIcons["IconGripVertical"];
    const EditIcon = TablerIcons["IconEdit"];

    useEffect(() => {
        if (labels)
            setItems(labels);
    }, [, labels])

    return (
        <Box
            bgcolor={getSecondBackgroundColor(theme)}
            p={4}
            borderRadius={4}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h5" fontWeight={500} flexGrow={1}>
                    Label Setting
                </Typography>
            </Stack>
            <Stack
                mt={2}
                direction="row"
                spacing={2}
                alignItems="center"
            >
                <Box flexGrow={1}>
                    <TextField
                        fullWidth
                        size="small"
                        margin="dense"
                        placeholder="Search label..."
                    />
                </Box>
                <Box>
                    <Button variant="contained" color="success" onClick={() => setOpenAddLabel(true)}>
                        Add
                    </Button>
                </Box>
            </Stack>
            {openAddLabel && <LabelAddItem labels={labels} project={project} setOpenAddLabel={setOpenAddLabel} />}
            <Stack
                direction="row"
                spacing={2}
                alignItems='stretch'
                flexWrap='wrap'
                useFlexGap
            >
                {labels.map((label) =>
                    <LabelListItem key={label?.id} label={label} labels={labels} />
                )}

            </Stack>
        </Box>
    );
};


const LabelAddItem = ({ labels, project, setOpenAddLabel }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const CancleIcon = TablerIcons["IconX"];
    const [name, setName] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState(null);
    const [isChange, setIsChange] = useState(false);

    // Ref for the component
    const wrapperRef = useRef(null);

    // Detect clicks outside of the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenAddLabel(false); // Close the component when clicking outside
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpenAddLabel]);

    useEffect(() => {
        setIsChange(name != null && name != "");
    }, [name]);

    const handleSaveLabel = async () => {
        const data = {
            name,
            projectId: project?.id
        };
        const response = await apiService.labelAPI.create(data);
        if (response?.data) {
            dispatch(setCurrentLabelList(updateAndAddArray(labels, [response?.data])));
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update label successful!",
                open: true
            }));
            setOpenAddLabel(false);
        }
    };

    return (
        <Stack
            ref={wrapperRef}
            direction='row'
            spacing={2}
            border='2px dashed'
            p={2}
            borderColor={theme.palette.success.main}
        >
            <Card sx={{ py: 2, px: 4, flexGrow: 1 }}>
                <Stack
                    direction="row"
                    spacing={4}
                    alignItems='center'
                >
                    <Stack direction='row' spacing={1} flexGrow={1} alignItems='center'>
                        <CustomColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                        <CustomBasicTextField
                            size="small"
                            margin="dense"
                            defaultValue={name}
                            fullWidth
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsChange(true);
                            }}
                        />
                    </Stack>
                </Stack>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                    onClick={handleSaveLabel}
                    disabled={!isChange}
                >
                    <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.success.main : theme.palette.grey[500]} />
                </IconButton>
            </Card>
            <Card sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={() => setOpenAddLabel(false)}>
                    <CancleIcon size={20} stroke={2} color={theme.palette.error.main} />
                </IconButton>
            </Card>
        </Stack>
    );
};


const LabelListItem = ({ label, labels }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconTrashXFilled"];
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const [name, setName] = useState(label.name);
    const [customization, setCustomization] = useState(label.customization);
    const [backgroundColor, setBackgroundColor] = useState(label?.customization?.backgroundColor);
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (label != null) {
            setName(label.name);
            setCustomization(label.setCustomization);
        }
    }, [label])

    useEffect(() => {
        if (backgroundColor != null && backgroundColor != label?.customization?.backgroundColor)
            setIsChange(true);
    }, [backgroundColor])


    const handleSaveLabel = async () => {
        const data = {
            "name": name,
            "customization": {
                'backgroundColor': backgroundColor
            }
        }
        const response = await apiService.labelAPI.update(label.id, data);
        if (response?.data) {
            dispatch(setCurrentLabelList(updateAndAddArray(labels, [response?.data])))
            setIsChange(false);
            dispatch(setSnackbar({
                content: "Update label successful!",
                open: true
            }))
        }
    }

    const handleOpenDeleteDialog = (event) => {
        event.stopPropagation();
        dispatch(setDeleteDialog({
            title: `Delete label "${name}"?`,
            content:
                `You're about to permanently delete this label. <strong>It's task will have empty label"</strong>.
                <br/><br/>
                If you're not sure, you can resolve or close this label instead.`,
            open: true,
            deleteType: "DELETE_LABEL",
            deleteProps: {
                labelId: label?.id
            }
        }));
    };

    return (
        <Card
            sx={{
                p: 2
            }}
        >
            <Stack direction='row' spacing={1} alignItems='center'>
                <CustomColorPickerDialog color={backgroundColor} setColor={setBackgroundColor} />
                <CustomBasicTextField
                    size="small"
                    margin="dense"
                    defaultValue={name}
                    sx={{
                        bgcolor: backgroundColor || '#0d9af2',
                        borderRadius: 2,
        
                    }}
                    InputProps={{
                        sx: {
                            color: backgroundColor && theme.palette.getContrastText(backgroundColor),
                            height: 30,
                            width: `${(name.length+1)*12}px`
                        },
                    }}
                    onChange={(e) => {
                        setName(e.target.value);
                        setIsChange(true);
                    }
                    }
                />
                {isChange ?
                    <IconButton
                        onClick={handleSaveLabel}
                    >
                        <SaveIcon size={20} stroke={2} color={isChange ? theme.palette.info.main : theme.palette.grey[500]} />
                    </IconButton>
                    :
                    !label?.systemRequired &&
                    <IconButton onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                }
            </Stack>


        </Card>
    );
}
export default CustomManageLabel;
