import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UnfoldLessTwoToneIcon from '@mui/icons-material/UnfoldLessTwoTone';
import { Box, Card, CardContent, IconButton, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../../App.css";
import AddCardKanban from './AddCardKanban';
import CardKanban from './CardKanban';
import { useSelector } from 'react-redux';
import * as apiService from "../../api/index"
import { useDispatch } from 'react-redux';
import { setCurrentKanbanTaskList } from '../../redux/actions/task.action';
import CustomStatusColorIconPicker from '../../components/CustomStatusColorIconPicker';
import CustomStatusPicker from '../../components/CustomStatusPicker';
import CustomStatus from '../../components/CustomStatus';

function KanbanDropNDrag() {
  const stores = useSelector((state) => state.task.currentKanbanTaskList);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.currentProject);

  useEffect(() => {
    if (project != null)
      initialFetch();
  }, [project])

  const initialFetch = async () => {
    const data = {
      "sortBy": "position",
      "sortDirectionAsc": true,
      "filters": []
    };

    await apiService.statusAPI.getPageByProject(project.id, data)
      .then(async (statusRes) => {
        const tempList = statusRes.data.content;

        const statusesWithTasks = await Promise.all(
          tempList.map(async (item) => {
            const taskData = {
              "sortBy": "position",
              "sortDirectionAsc": true,
              "filters": [
                {
                  "key": "status.id",
                  "operation": "EQUAL",
                  "value": item.id,
                  "values": []
                }
              ]
            };

            await apiService.taskAPI.getPageByProject(item.projectId, taskData)
              .then(taskRes => {
                item.items = taskRes.data.content;
              })
              .catch(taskErr => {
                console.warn(`Error fetching tasks for status ${item.id}:`, taskErr);
                item.items = []
              });

            return item;
          })
        );
        dispatch(setCurrentKanbanTaskList(statusesWithTasks));
      })
      .catch(statusErr => console.warn("Error fetching statuses:", statusErr));
  };

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

      return dispatch(setCurrentKanbanTaskList(reorderedStores))
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    console.log(source.droppableId);

    const storeSourceIndex = stores.findIndex(
      (store) => store.id.toString() === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id.toString() === destination.droppableId
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

    dispatch(setCurrentKanbanTaskList(newStores))
  };

  return (
    <div className="layout__wrapper">
      <div className="card">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <Droppable droppableId="ROOT" type="group" direction="horizontal">
            {(provided) => (
              <Stack direction='row' spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
                {stores?.map((status, index) => (
                  <Draggable
                    draggableId={status.id.toString()}
                    index={index}
                    key={status.id}>
                    {(provided) => (
                      <Box
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <StoreList {...status} status={status} />
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

function StoreList({ id, name, projectId, items, isFromStart, isFromAny, status }) {
  const theme = useTheme();

  return (
    <Droppable droppableId={id.toString()}>
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: snapshot.isDraggingOver ? theme.palette.text.secondary
                : 'transparent'
            }}
          >
            <Box
              mb={2}
              p={2}
              width={320}
              boxShadow={1}
              borderRadius={2}
              bgcolor={theme.palette.mode === "light" ? "#F6F7FA" : lighten(theme.palette.background.default, 0.2)}

            >
              <Box >
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={2}
                >
                  <Box flexGrow={1}>
                    <CustomStatus status={status} changeable={false} />
                  </Box>
                  {/* Action buttons */}
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
            </Box>


            <Box height='calc(100vh - 230px)'
              sx={{
                pb: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '0.6em',
                },
                '&::-webkit-scrollbar-track': {
                  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                  webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundClip: 'padding-box',
                  backgroundColor: 'slategrey',
                  borderLeft: 'solid 4px transparent'

                }
              }}
            >
              <Stack spacing={2}>
                {items?.map((task, index) => (
                  <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <CardKanban task={task} />
                      </div>
                    )}

                  </Draggable>

                ))}
                {provided.placeholder}

              </Stack>
            </Box>
          </Box>
        </div>
      )}
    </Droppable>
  );
}

export default KanbanDropNDrag;
