import { Card, CardContent, TextField, Stack, Box, Button, useTheme } from "@mui/material";
import * as TablerIcon from "@tabler/icons-react"
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as apiService from "../../api/index"

const AddCardKanban = ({currentGroupBy, groupId }) => {
    const theme = useTheme();
    const [openAddTask, setOpenAddTask] = useState();
    const [name, setName] = useState("");
    const project = useSelector((state) => state.project.currentProject);
    const AddIcon = TablerIcon["IconPlus"];

    const cardRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setOpenAddTask(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cardRef]);

    const handleAddTask = async () => {
        if (name != null && name.trim() != "") {
            const data = {
                "name": name,
                "projectId": project.id,
                "statusId": groupId,
            }
            console.log(groupId)
            await apiService.taskAPI.create(data)
                .then(taskRes => console.log(taskRes))
                .catch(taskErr => console.warn(taskErr))
        }
        setOpenAddTask(false);
    }

    return (
        <>
            {!openAddTask
                ?
                <Button
                    variant='text'
                    onClick={(e) => setOpenAddTask(true)}
                    sx={{
                        textTransform: 'none',
                        fontSize: '14px',
                        justifyContent: 'flex-start',
                        color: theme.palette.text.secondary
                    }} startIcon={<AddIcon fontSize='small' />}>
                    Add task
                </Button>
                :
                <Card
                    ref={cardRef}
                    sx={{ bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#22272B" }}
                >
                    <CardContent
                        sx={{
                            p: 4
                        }}
                    >

                        <TextField
                            variant='standard'
                            placeholder='What need to be done'
                            autoFocus
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{ disableUnderline: true }}
                        />
                        <Stack width='100%'>
                            <Box
                                alignSelf='flex-end'
                            >
                                <Button
                                    variant='contained'
                                    color='success'
                                    size='small'
                                    onClick={handleAddTask}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            }
        </>

    );
}

export default AddCardKanban;