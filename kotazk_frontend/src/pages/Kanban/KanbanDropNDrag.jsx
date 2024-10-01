import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UnfoldLessTwoToneIcon from '@mui/icons-material/UnfoldLessTwoTone';
import { Box, Button, Card, CardContent, IconButton, Paper, Stack, Typography, alpha, darken, lighten, useTheme } from "@mui/material";
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
import CustomDialogForManage from '../../components/CustomDialogForManage';
import CustomManageStatus from '../../components/CustomManageStatusDialog';
import * as TablerIcon from "@tabler/icons-react"
import { getSecondBackgroundColor } from '../../utils/themeUtil';
import { applyTaskFilters } from '../../utils/filterUtil';

function KanbanDropNDrag() {
  const theme = useTheme();
  const SettingIcon = TablerIcon["IconSettings"];
  const [stores, setStores] = useState([]);
  const tasks = useSelector((state) => state.task.currentTaskList);
  const statuses = useSelector((state) => state.status.currentStatusList);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.currentProject);
  const [openGroupByEntityDialog, setOpenGroupByEntityDialog] = useState(false);
  const filters = useSelector((state) => state.filter.currentFilterList);

  useEffect(() => {
    if (statuses != null && project != null)
      initialFetch();
  }, [project, statuses, filters]);

  useEffect(() => {
    if (tasks != null && statuses != null)
      tasksMapping();
  }, [statuses, tasks, filters])


  const initialFetch = async () => {
    try {
      const allTasks = await Promise.all(
        statuses.map(async (status) => {
          // Define the filter for the current status
          const statusFilter = {
            key: "status.id",
            operation: "EQUAL",
            value: status.id,
            values: []
          };

          // Prepare filters: if `filters` is null or undefined, use an empty array
          const currentFilters = filters || [];

          // Create the task data, merging the current filters with the status filter
          const taskData = {
            sortBy: "position",
            sortDirectionAsc: true,
            filters: [...currentFilters, statusFilter] // Combine filters
          };

          const taskRes = await apiService.taskAPI.getPageByProject(status.projectId, taskData);
          return taskRes.data.content; // Return the task content
        })
      );

      const combinedTasks = updateAndAddArray(tasks, allTasks.flat());
      dispatch(setCurrentTaskList(combinedTasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  // Utility method for updating filters with a status filter
  const updateFiltersWithStatus = (filters, statusId) => {
    const statusFilter = {
      key: "status.id",
      operation: "EQUAL",
      value: statusId,
      values: []
    };

    // Check if filters is null, undefined, or an empty array
    if (!filters || filters.length === 0) {
      return [statusFilter];
    }

    return [...filters, statusFilter];
  };


  const tasksMapping = () => {
    console.log(filters);
    const filteredTasks = applyTaskFilters(tasks, filters);
    console.log(tasks)
    const groupedTasks = statuses.reduce((acc, status) => {
      const tasksForStatus = filteredTasks.filter(task => task.statusId === status.id);

      acc.push({
        ...status,
        items: tasksForStatus,
      });

      return acc;
    }, []);

    setStores(groupedTasks);
  };

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
    <Box
      pr={2}
    >
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <Droppable droppableId="ROOT" type="group" direction="horizontal">
          {(provided) => (
            <Stack direction='row'
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ overflowX: 'auto' }}
            >
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
                      <StoreList {...status} status={status} setOpenGroupByEntityDialog={setOpenGroupByEntityDialog} />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Box>
                <Paper
                  sx={{
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    height: '100%'
                  }}
                >
                  <Button
                    variant='outlined'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    fullWidth
                    onClick={() => setOpenGroupByEntityDialog(true)}
                    startIcon={<SettingIcon stroke={2} size={18} />}
                    sx={{
                      height: '100%',
                      wordWrap: 'normal'
                    }}
                  >
                    <Typography noWrap>
                      Manage Status
                    </Typography>
                  </Button>
                </Paper>
              </Box>

            </Stack>
          )}
        </Droppable>
      </DragDropContext>

      <CustomDialogForManage children={<CustomManageStatus />} open={openGroupByEntityDialog} setOpen={setOpenGroupByEntityDialog} />
      <CustomTaskDialog />
    </Box>
  );
}

function StoreList({ id, name, projectId, items, isFromStart, isFromAny, status, setOpenGroupByEntityDialog }) {
  const theme = useTheme();
  const [collapse, setCollapse] = useState(false);
  const EditIcon = TablerIcon["IconEditCircle"];
  const CollapseIcon = TablerIcon["IconLayoutSidebarLeftCollapseFilled"];
  return (
    <Droppable droppableId={id.toString()}>
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              position: 'relative',
              minHeight: 320,
              width: !collapse ? "auto" : 40,
              background: `linear-gradient(180deg, 
              ${alpha(status?.customization?.backgroundColor || theme.palette.background.default, snapshot.isDraggingOver ? 0.6 : 0.3)} 0%,  
              ${alpha(status?.customization?.backgroundColor || theme.palette.background.default, snapshot.isDraggingOver ? 0.3 : 0.1)} 100%)`
            }}
          >
            <Box
              mb={1}
              p={2}
              width={320}
              boxShadow={1}
              borderRadius={2}
              bgcolor={theme.palette.mode === "light" ? "#F6F7FA" : lighten(theme.palette.background.default, 0.2)}
              sx={{
                transform: collapse ? 'rotate(90deg) translateY(-100%)' : 'none',
                transformOrigin: '0 0',
                position: collapse ? 'absolute' : 'relative', // Apply absolute positioning when collapsed
                top: 0,
                left: 0,
              }}
            >
              <Stack
                direction='row'
                alignItems='center'
                spacing={2}
                maxWidth={320}
              >
                <Box flexGrow={1}>
                  <CustomStatus status={status} changeable={false} />
                </Box>
                {/* Action buttons */}
                <IconButton size="small" onClick={() => setCollapse(!collapse)}>
                  <CollapseIcon fontSize='inherit' stroke={2} size={18} />
                </IconButton>
                <IconButton size="small" onClick={() => setOpenGroupByEntityDialog(true)}>
                  <EditIcon fontSize='inherit' stroke={2} size={18} />
                </IconButton>
              </Stack>
            </Box>


            {!collapse && <Box height='calc(100vh - 268px)'
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
              <Stack spacing={0.5}>
                {items?.map((task, index) => (
                  <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <CardKanban task={task} isDragging={snapshot.isDragging} />
                      </div>
                    )}

                  </Draggable>

                ))}
                {provided.placeholder}

              </Stack>
            </Box>
            }
          </Box>
        </div>
      )}
    </Droppable>
  );
}

export default KanbanDropNDrag;
