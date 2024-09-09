import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import UnfoldLessTwoToneIcon from '@mui/icons-material/UnfoldLessTwoTone';
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../../App.css";
import { darken, lighten, alpha } from '@mui/material';
import CardKanban from './CardKanban';

const DATA = [
  {
    id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
    name: "Walmart",
    customization: {
      backgroundColor: "#E5826F"
    },
    items: [
      { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
      { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
    ],
    tint: 1,
  },
  {
    id: "487f68b4-1746-438c-920e-d67b7df46247",
    name: "Indigo",
    customization: {
      backgroundColor: "#7F7CFF"
    },
    items: [
      {
        id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
        name: "Designing Data Intensive Applications",
      },
      { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
    ],
    tint: 2,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
    name: "Lowes",
    customization: {
      backgroundColor: "#54D585"
    },
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
      { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
    ],
    tint: 3,
  },
];

function KanbanDropNDrag() {
  const [stores, setStores] = useState(DATA);

  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...stores];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      return setStores(reorderedStores);
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };

  return (
    <div className="layout__wrapper">
      <div className="card">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <Droppable droppableId="ROOT" type="group" direction="horizontal">

            {(provided) => (

              <Stack direction='row' spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store.id}
                    index={index}
                    key={store.id}
                  >
                    {(provided) => (
                      <Box
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <StoreList {...store} />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}

          </Droppable>

        </DragDropContext>
      </div>
    </div>
  );
}

function StoreList({ name, items, id, customization }) {
  const theme = useTheme();
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div  {...provided.droppableProps} ref={provided.innerRef}>
          <Card
            sx={{
              width: 320,
              boxShadow: "none",
              borderRadius: 2,
              bgcolor: theme.palette.mode === "light" ? "#F1F2F4" : "#121212"
            }}
          >
            <CardContent>
              <Box mb={2}>
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={1}
                >
                  <Box flexGrow={1}>
                    <Typography variant='body1' fontWeight='bold'>
                      {name}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <UnfoldLessTwoToneIcon fontSize='inherit' />
                  </IconButton>
                  <IconButton size="small">
                    <MoreHorizIcon fontSize='inherit' />
                  </IconButton>
                  <IconButton size="small">
                    <AddIcon fontSize='inherit' />
                  </IconButton>
                </Stack>
              </Box>


              <Stack spacing={2}>
                {items.map((item, index) => (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <CardKanban />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Button variant='text'
                  sx={{
                    textTransform: 'none',
                    fontSize: '14px',
                    justifyContent: 'flex-start',
                    color: theme.palette.text.secondary
                  }} startIcon={<AddIcon fontSize='small' />}>
                  Add task
                </Button>
              </Stack>

            </CardContent>
          </Card>
        </div>
      )}
    </Droppable>
  );
}

export default KanbanDropNDrag;