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
import { setCurrentKanbanTaskList, setCurrentTaskList } from '../../redux/actions/task.action';
import CustomStatusColorIconPicker from '../../components/CustomStatusColorIconPicker';
import CustomStatusPicker from '../../components/CustomStatusPicker';
import CustomStatus from '../../components/CustomStatus';
import { updateAndAddArray } from '../../utils/arrayUtil';
import CustomTaskDialog from '../../components/CustomTaskDialog';

function KanbanDropNDrag() {
  const [stores, setStores] = useState([]);
  const tasks = useSelector((state) => state.task.currentTaskList);
  const statuses = useSelector((state) => state.status.currentStatusList);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.currentProject);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(false);

  useEffect(() => {
    if (statuses != null && project != null)
      initialFetch();
  }, [project, statuses]);

  useEffect(() => {
    if (tasks != null && statuses != null)
      tasksMapping();
  }, [statuses, tasks])


  const initialFetch = async () => {
    try {
      const allTasks = await Promise.all(
        statuses.map(async (status) => {
          const taskData = {
            "sortBy": "position",
            "sortDirectionAsc": true,
            "filters": [
              {
                "key": "status.id",
                "operation": "EQUAL",
                "value": status.id,
                "values": []
              }
            ]
          };

          const taskRes = await apiService.taskAPI.getPageByProject(status.projectId, taskData);
          return taskRes.data.content;
        })
      );

      const combinedTasks = updateAndAddArray(tasks, allTasks.flat());
      dispatch(setCurrentTaskList(combinedTasks));
      console.log(combinedTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const tasksMapping = () => {
    const groupedTasks = statuses.reduce((acc, status) => {
      const tasksForStatus = tasks.filter(task => task.statusId === status.id);
      acc.push({
        ...status,
        items: tasksForStatus
      });


      return acc;
    }, []);
    setStores(groupedTasks);
  }
  const updateItemAPI = async (itemId, previousItemId, nextItemId, statusId) => {
    console.log(nextItemId)
    const data = {
      rePositionReq: (nextItemId == null && previousItemId == null) ? null : {
        currentItemId: itemId,
        nextItemId: nextItemId,
        previousItemId: previousItemId
      },
      statusId: statusId
    };


    const response = await apiService.taskAPI.update(itemId, data);
    if (response?.data) {
      const finalAr = updateAndAddArray(tasks, [response.data]);
      dispatch(setCurrentTaskList(finalAr));
      console.log(finalAr)
    }
  };

  const handleDragAndDrop = async (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    if (type === "group") {
      const reorderedStores = [...stores];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      setStores(reorderedStores);
      // Optionally call updateGroupAPI here if needed
      return;
    }

    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

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

    setStores(newStores);

    // Call API to update items with previous and next item IDs and group ID
    const previousItemId = itemDestinationIndex > 0
      ? newSourceItems[itemDestinationIndex - 1]?.id
      : null;
    const nextItemId = newDestinationItems[itemDestinationIndex + 1]?.id;
    const statusId = stores[storeDestinationIndex]?.id; // Get the status ID from the destination store

    await updateItemAPI(deletedItem.id, previousItemId, nextItemId, statusId);
  };


  return (
    <>
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
      <CustomTaskDialog />
    </>
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
