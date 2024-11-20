import React, { useState } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Dữ liệu mẫu cho workspace
const initialWorkspaces = [
    { id: "workspace-1", title: "Workspace 1", tagName: "Marketing", createdAt: "2024-11-10" },
    { id: "workspace-2", title: "Workspace 2", tagName: "Development", createdAt: "2024-11-09" },
    { id: "workspace-3", title: "Workspace 3", tagName: "Design", createdAt: "2024-11-08" },
    { id: "workspace-4", title: "Workspace 4", tagName: "Sales", createdAt: "2024-11-07" },
    { id: "workspace-5", title: "Workspace 5", tagName: "Support", createdAt: "2024-11-06" },
];

const ListWorkspace = () => {
    const [workspaces, setWorkspaces] = useState(initialWorkspaces);

    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) return;
        if (destination.index === source.index) return;

        const reorderedWorkspaces = Array.from(workspaces);
        const [removed] = reorderedWorkspaces.splice(source.index, 1);
        reorderedWorkspaces.splice(destination.index, 0, removed);

        setWorkspaces(reorderedWorkspaces);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="workspaces" direction="vertical">
                {(provided) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        {workspaces.map((workspace, index) => (
                            <Draggable key={workspace.id} draggableId={workspace.id} index={index}>
                                {(provided) => (
                                    <Card
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                                            padding: 2,
                                            backgroundColor: "white",
                                            boxShadow: 3,
                                            cursor: "move",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography variant="h6">{workspace.title}</Typography>
                                        <Stack direction="row" spacing={2} mt={1}>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Tag:</strong> {workspace.tagName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Created:</strong> {workspace.createdAt}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ListWorkspace;