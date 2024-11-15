import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Stack, Paper } from '@mui/material';

const DraggableStack = () => {
    const [items, setItems] = useState([
        { id: '1', content: 'Item 1' },
        { id: '2', content: 'Item 2' },
        { id: '3', content: 'Item 3' },
        { id: '4', content: 'Item 4' },
        { id: '5', content: 'Item 5' },
        { id: '6', content: 'Item 6' },
        { id: '7', content: 'Item 7' },
        { id: '8', content: 'Item 8' },
    ]);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);

        setItems(newItems);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="stack" direction="horizontal" type="STACK">
                {(provided) => (
                    <Stack
                        direction={'row'}
                        spacing={2}
                        flexWrap='wrap'
                        useFlexGap
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center', width: 600 }}>
                                            {item.content}
                                        </Paper>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableStack;
