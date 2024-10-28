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
import { setCurrentGroupedTaskList, setCurrentKanbanTaskList, setCurrentTaskList } from '../../redux/actions/task.action';
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
const [openGroupByEntityDialog, setOpenGroupByEntityDialog] = useState(false);

  const [tasks, setTasks] = useState(null);
  // const [groupByEntity, setGroupByEntity] = useState("taskType");
  const groupByEntity = useSelector((state) => state.groupBy.currentGroupByEntity)
  const [groupByEntityList, setGroupByEntityList] = useState(null);
  // const [groupedTasks, setGroupedTasks] = useState(null);
  const groupedTasks = useSelector((state) => state.task.currentGroupedTaskList);
  const project = useSelector((state) => state.project.currentProject);
  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      fetchGroupByEntityList();
      fetchTasks();
    }
  }, [project, groupByEntity]);

  useEffect(() => {
    if (tasks && groupByEntityList) {
      groupTasks();
    }
  }, [tasks, groupByEntityList]);




  const fetchGroupByEntityList = async () => {
    const data = {
      'sortBy': 'position',
      'sortDirectionAsc': true,
      'filters': []
    }
    let groupByEntityListResponse = null;
    if (groupByEntity == 'status') groupByEntityListResponse = await apiService.statusAPI.getPageByProject(project.id, data)
    else if (groupByEntity == 'taskType') groupByEntityListResponse = await apiService.taskTypeAPI.getPageByProject(project.id, data)
    else if (groupByEntity == 'priority') groupByEntityListResponse = await apiService.priorityAPI.getPageByProject(project.id, data)

    if (groupByEntityListResponse?.data)
      setGroupByEntityList(groupByEntityListResponse?.data.content)
  }

  const fetchTasks = async () => {
    const data = {
      'sortBy': 'position',
      'sortDirectionAsc': true,
      'filters': []
    }

    const taskListResponse = await apiService.taskAPI.getPageByProject(project.id, data)

    if (taskListResponse?.data) {
      setTasks(taskListResponse?.data?.content)
    }
  }


  const groupTasks = () => {
    const grouped = groupByEntityList.reduce((acc, entity) => {
      const key = entity.id; // Assuming entity.id matches task's groupByEntity value
      const items = tasks?.filter(task => task[groupByEntity]?.id == key);
      acc.push({
        ...entity,
        items: items || [],
        droppableId: String(entity.id)
      });
      return acc;
    }, []);
    dispatch(setCurrentGroupedTaskList(
      {
        list: grouped,
        groupedEntity: groupByEntity
      }
    ));
    console.log(groupedTasks)
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Do nothing if dropped outside the list
    if (!destination) return;

    const sourceGroupIndex = groupedTasks.findIndex(group => String(group.id) === String(source.droppableId));
    const destinationGroupIndex = groupedTasks.findIndex(group => String(group.id) === String(destination.droppableId));

    console.log(123)

    if (sourceGroupIndex === -1 || destinationGroupIndex === -1 ||
      (sourceGroupIndex === destinationGroupIndex && source.index === destination.index)) {
      return;
    }

    console.log(456)

    const sourceItems = Array.from(groupedTasks[sourceGroupIndex].items);
    const destinationItems = sourceGroupIndex === destinationGroupIndex ? sourceItems : Array.from(groupedTasks[destinationGroupIndex].items);

    const [movedTask] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, movedTask);

    // setGroupedTasks(prevGroupedTasks => {
    //     const updatedGroups = [...prevGroupedTasks];
    //     updatedGroups[sourceGroupIndex] = { ...updatedGroups[sourceGroupIndex], items: sourceItems };
    //     if (sourceGroupIndex !== destinationGroupIndex) {
    //         updatedGroups[destinationGroupIndex] = { ...updatedGroups[destinationGroupIndex], items: destinationItems };
    //     }

    //     console.log(updatedGroups)
    //     return updatedGroups;
    // });

    dispatch(setCurrentGroupedTaskList({
      list: (prevGroupedTasks => {
        const updatedGroups = [...prevGroupedTasks];
        updatedGroups[sourceGroupIndex] = {
          ...updatedGroups[sourceGroupIndex],
          items: sourceItems,
        };
        if (sourceGroupIndex !== destinationGroupIndex) {
          updatedGroups[destinationGroupIndex] = {
            ...updatedGroups[destinationGroupIndex],
            items: destinationItems,
          };
        }
        return updatedGroups;
      })(groupedTasks),
      groupedEntity: groupByEntity
    }));


  };

  return (
    <Box
      pr={2}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="ROOT" type="group" direction="horizontal">
          {(provided) => (
            <Stack direction='row'
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ overflowX: 'auto' }}
            >
              {groupedTasks?.map((gt, index) => (
                <Draggable
                  draggableId={gt.id.toString()}
                  index={index}
                  key={gt.id}>
                  {(provided) => (
                    <Box
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <StoreList {...gt} groupByEntity={gt} setOpenGroupByEntityDialog={setOpenGroupByEntityDialog} />
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
                    // startIcon={<SettingIcon stroke={2} size={18} />}
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

function StoreList({ id, name, projectId, items, isFromStart, isFromAny, groupByEntity, setOpenGroupByEntityDialog }) {
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
              ${alpha(groupByEntity?.customization?.backgroundColor || theme.palette.background.default, snapshot.isDraggingOver ? 0.6 : 0.3)} 0%,  
              ${alpha(groupByEntity?.customization?.backgroundColor || theme.palette.background.default, snapshot.isDraggingOver ? 0.3 : 0.1)} 100%)`
            }}
          >
            <Box
              mb={1}
              p={2}
              width={320}
              // boxShadow={1}
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
                  {groupByEntity.name}
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
