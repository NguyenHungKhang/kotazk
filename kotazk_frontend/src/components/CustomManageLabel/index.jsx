import { Box, Button, Card, Checkbox, Divider, Grid, IconButton, Stack, TextField, ToggleButton, Typography, alpha, useTheme } from "@mui/material";
import { getCustomTwoModeColor, getSecondBackgroundColor } from "../../utils/themeUtil";
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

const CustomManageLabel = ({ handleClose, isDialog }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject)
    const [newLabelNumber, setNewLabelNumbeer] = useState(0);
    const [items, setItems] = useState([]);
    const AddIcon = TablerIcons["IconPlus"];
    const CloseIcon = TablerIcons["IconX"];
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (project)
            fetchStatus();
    }, [project])

    const fetchStatus = async () => {
        const data = {
            'sortBy': 'name',
            'sortDirectionAsc': true,
            "filters": []
        }

        const response = await apiService.labelAPI.getPageByProject(project.id, data)
        if (response?.data) {
            setItems(response?.data?.content)
        }
    }

    const addNewItem = () => {
        const newItem = {
            "id": `newLabel-${newLabelNumber}`,
            "projectId": project?.id,
            "name": `Label ${items.length + 1}`,
            "customization": {
                "backgroundColor": "#0d9af2",
            }
        }
        setItems(prev => [newItem, ...prev]);
        setNewLabelNumbeer(prev => prev + 1);
        setIsChange(true);
    }


    const handleSave = async () => {
        const data = items.map((item) => {
            if (item.id.toString().startsWith("newLabel-")) {
                const { id, ...rest } = item;
                return rest;
            }
            return item;
        });
        const response = await apiService.labelAPI.saveList(project?.id, data);
        if (response?.data) {
            setItems(response.data);
            dispatch(setSnackbar({
                content: "Update labels successful!",
                open: true
            }));
        }
        setIsChange(false);
    }

    return (
        <Card
            sx={{
                p: 4
            }}
        >
            <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant="h6" fontWeight={500} flexGrow={1}>
                    Label Setting
                </Typography>
                {
                    isDialog && (
                        <Box>
                            <IconButton onClick={handleClose}>
                                <CloseIcon size={18} stroke={2} />
                            </IconButton>
                        </Box>
                    )
                }

            </Stack>
            <Box
                sx={{
                    p: 2
                }}
            >
                <Stack
                    mb={2}
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
                </Stack>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems='stretch'
                    flexWrap='wrap'
                    useFlexGap
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Button
                            size="small"
                            onClick={() => addNewItem()}
                            color={getCustomTwoModeColor(theme, "customBlack", "customWhite")}
                            fullWidth
                            startIcon={<AddIcon size={18} stroke={2} />}
                            sx={{
                                border: '1px dashed',
                                borderRadius: 2,
                                width: '250px'
                            }}
                        >
                            Add Lable
                        </Button>
                    </Box>
                    {items?.map((label, index) =>
                        <LabelListItem key={label?.id} label={label} setItems={setItems} itemIndex={index} isChange={isChange} setIsChange={setIsChange} />
                    )}

                </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack direction={'row'} justifyContent={'flex-end'} width={'100%'}>
                <Box>
                    <Button size="small" variant='contained' color='primary' onClick={() => handleSave()} disabled={!isChange}>
                        Save
                    </Button>
                </Box>
            </Stack>
        </Card>
    );
};

const LabelListItem = ({ label, setItems, itemIndex, isChange, setIsChange }) => {
    const textLengthRef = useRef(null);
    const theme = useTheme();
    const dispatch = useDispatch();
    const DeleteIcon = TablerIcons["IconX"];
    const SaveIcon = TablerIcons["IconDeviceFloppy"];
    const [name, setName] = useState(label.name);
    const [customization, setCustomization] = useState(label.customization);
    const [backgroundColor, setBackgroundColor] = useState(label?.customization?.backgroundColor);
    const [textLength, setTextLength] = useState(0);

    useEffect(() => {
        if (label != null) {
            setName(label.name);
            setCustomization(label.setCustomization);
        }
    }, [label])

    useEffect(() => {
        if (name && name != label?.name) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    { ...item, name: name } : item))
            setIsChange(true);
        }
    }, [name])


    useEffect(() => {
        if (backgroundColor != null && backgroundColor != label?.customization?.backgroundColor) {
            setItems(prev => prev.map((item, index) =>
                index == itemIndex ?
                    {
                        ...item, customization: {
                            backgroundColor: backgroundColor
                        }
                    } : item))
            setIsChange(true);
        }
    }, [backgroundColor])

    const handleOpenDeleteDialog = (event) => {
        setItems(prev => prev.filter((item, index) => index != itemIndex));
        setIsChange(true)
    };

    useEffect(() => {
        if (textLengthRef.current) {
            setTextLength(textLengthRef.current.offsetWidth);
        }
    }, []);

    return (
        <Card
            sx={{
                width: 'fit-content',
                minWidth: 0,
                px: 1,
                py: 0,
                boxShadow: 0,
                borderRadius: 2,
                bgcolor: alpha(backgroundColor, 0.5)
            }}
        >
            <Stack direction='row' spacing={1} alignItems='center'>
                <CustomColorPickerDialog color={backgroundColor} setColor={setBackgroundColor} />
                <Stack>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <CustomBasicTextField
                            size="small"
                            // margin="dense"
                            hiddenLabel={true}
                            defaultValue={name}
                            fullWidth
                            sx={{
                                my: 1,
                                bgcolor: backgroundColor || '#0d9af2',
                                borderRadius: 2,

                            }}
                            InputProps={{
                                sx: {
                                    color: backgroundColor && theme.palette.getContrastText(backgroundColor),
                                    height: 30,
                                },
                            }}
                            onChange={(e) => {
                                setName(e.target.value);
                                setIsChange(true);
                            }}
                        />
                    </Box>
                    <Box
                        flexGrow={1}
                        height={"0 !important"}
                        // position={'absolute'}
                        visibility={'hidden'}
                        mx={4}
                    >
                        {name}
                    </Box>
                </Stack>
                <Box
                    bgcolor={"#fff"}
                    borderRadius={2}
                >
                    <IconButton size="small" onClick={(e) => handleOpenDeleteDialog(e)}>
                        <DeleteIcon size={20} stroke={2} color={theme.palette.error.main} />
                    </IconButton>
                </Box>
            </Stack>


        </Card>
    );
}
export default CustomManageLabel;
