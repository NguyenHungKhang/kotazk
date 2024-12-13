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
import { setAddTaskDialog } from '../../redux/actions/dialog.action';
import dayjs from 'dayjs';

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
  const currentFilterList = useSelector((state) => state.filter.currentFilterList);
  const sortEntity = useSelector((state) => state.sort.currentSortEntity);
  const sortAscDirection = useSelector((state) => state.sort.currentSortDirection);
  const taskSearchText = useSelector((state) => state.searchText.taskSearchText)
  const dispatch = useDispatch();
  const currentMember = useSelector((state) => state.member.currentUserMember);
  const createTaskPermission = currentMember?.role?.projectPermissions?.includes("CREATE_TASKS");
  const editTaskPermission = currentMember?.role?.projectPermissions?.includes("EDIT_TASKS");
  const deleteTaskPermission = currentMember?.role?.projectPermissions?.includes("DELETE_TASKS");
  const scheduleTaskPermission = currentMember?.role?.projectPermissions?.includes("SCHEDULE_TASKS");
  const assignTaskPermission = currentMember?.role?.projectPermissions?.includes("ASSIGN_TASKS");

  useEffect(() => {
    if (project) {
      fetchGroupByEntityList();
    }
  }, [project, groupByEntity]);

  useEffect(() => {
    if (project && groupByEntityList && currentFilterList && sortEntity && sortAscDirection) {
      fetchTasks();
    }
  }, [project, groupByEntityList, currentFilterList, sortEntity, sortAscDirection, taskSearchText]);

  useEffect(() => {
    if (tasks && groupByEntityList) {
      groupTasks();
    }
  }, [tasks, groupByEntityList]);




  const fetchGroupByEntityList = async () => {
    const data = {
      'sortBy': groupByEntity == 'assignee' ? 'user.lastName' : 'position',
      'sortDirectionAsc': true,
      'filters': []
    }
    let groupByEntityListResponse = null;
    if (groupByEntity == 'status') groupByEntityListResponse = await apiService.statusAPI.getPageByProject(project.id, data)
    else if (groupByEntity == 'taskType') groupByEntityListResponse = await apiService.taskTypeAPI.getPageByProject(project.id, data)
    else if (groupByEntity == 'priority') {
      groupByEntityListResponse = await apiService.priorityAPI.getPageByProject(project.id, data)
      if (groupByEntityListResponse?.data)
        setGroupByEntityList([...groupByEntityListResponse.data.content, { "id": 0, "name": "No priority*" }])
      return;
    }
    else if (groupByEntity == 'assignee') {
      groupByEntityListResponse = await apiService.memberAPI.getPageByProject(project.id, data);
      if (groupByEntityListResponse?.data)
        setGroupByEntityList([...groupByEntityListResponse.data.content, { "id": 0, "name": "No assignee*" }])
      return;
    }
    else if (groupByEntity == 'isCompleted') {
      setGroupByEntityList([{ "id": 1, "name": "Completion", "value": true }, { "id": 0, "name": "Uncompletion", "value": false }])
      return;
    }

    if (groupByEntityListResponse?.data)
      setGroupByEntityList(groupByEntityListResponse?.data.content)
  }

  const fetchTasks = async () => {
    const filterData = [
      ...(currentFilterList?.flatMap((f) => {
        if (f.field === "startAt") {
          return {
            key: f.field,
            operation: "GREATER_THAN_OR_EQUAL",
            value: dayjs(f.options?.[0]).valueOf(),
          };
        }
        if (f.field === "endAt") {
          return {
            key: f.field,
            operation: "LESS_THAN_OR_EQUAL",
            value: dayjs(f.options?.[0]).valueOf(),
          };
        }
        return {
          key: f.field,
          operation: "IN",
          values: f.options,
        };
      }) || []),
      {
        key: "name",
        operation: "LIKE",
        value: taskSearchText,
      },
      {
        key: "parentTask",
        operation: "IS_NULL",
        value: null,
      },
    ];

    const data = {
      'sortBy': sortEntity,
      'sortDirectionAsc': sortAscDirection == "descending" ? false : true,
      'pageSize': 50,
      'filters': filterData || []
    }

    const taskListResponse = await apiService.taskAPI.getPageByProject(project.id, data)

    if (taskListResponse?.data) {
      setTasks(taskListResponse?.data?.content)
    }
  }


  const groupTasks = () => {
    const grouped = groupByEntityList.reduce((acc, entity) => {
      if (groupByEntity == "isCompleted") {
        const key = entity.value;
        const items = tasks?.filter(task => task[groupByEntity] == key);
        acc.push({
          ...entity,
          items: items || [],
          droppableId: String(entity.value)
        });
      } else {
        const key = entity.id;
        const items = tasks?.filter(task => {

          if (groupByEntity == "priority")
            if (key == 0) {
              return task[groupByEntity] == null;
            }

          return task[groupByEntity]?.id == key;

        });
        acc.push({
          ...entity,
          items: items || [],
          droppableId: String(entity.id)
        });
      }
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


  const handleSaveDnD = async (dstGroupId, currentItemId, nextItemId, previousItemId) => {
    const rePositionReq = (nextItemId || previousItemId) ? {
      currentItemId,
      nextItemId,
      previousItemId
    } : null;

    const groupMappings = {
      status: "statusId",
      taskType: "taskTypeId",
      priority: "priorityId",
      assignee: "assigneeId",
      isCompleted: "isCompleted"
    };
    const groupField = groupMappings[groupByEntity];

    let groupValue;
    if (groupByEntity == "isCompleted")
      groupValue = dstGroupId == "1"
    else {
      groupValue = dstGroupId || null;
    }

    if (groupValue == null && !rePositionReq) return null;

    const data = {
      [groupField]: groupValue,
      rePositionReq
    };

    try {
      const response = await apiService.taskAPI.update(currentItemId, data);
      if (response?.data) {
        return response?.data
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      return null;
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // Exit if dropped outside the list or no movement
    if (!destination) return;

    const sourceGroupIndex = groupedTasks.findIndex(group => String(group.id) === String(source.droppableId));
    const destinationGroupIndex = groupedTasks.findIndex(group => String(group.id) === String(destination.droppableId));

    if (sourceGroupIndex === -1 || destinationGroupIndex === -1 ||
      (sourceGroupIndex === destinationGroupIndex && source.index === destination.index)) {
      return;
    }

    // Optimistically update the UI
    const sourceItems = Array.from(groupedTasks[sourceGroupIndex].items);
    const destinationItems = sourceGroupIndex === destinationGroupIndex
      ? sourceItems
      : Array.from(groupedTasks[destinationGroupIndex].items);

    const [movedTask] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, movedTask);

    dispatch(setCurrentGroupedTaskList({
      list: (prevGroupedTasks => {
        const updatedGroups = [...prevGroupedTasks];
        updatedGroups[sourceGroupIndex] = {
          ...updatedGroups[sourceGroupIndex],
          items: sourceItems
        };
        if (sourceGroupIndex !== destinationGroupIndex) {
          updatedGroups[destinationGroupIndex] = {
            ...updatedGroups[destinationGroupIndex],
            items: destinationItems
          };
        }
        return updatedGroups;
      })(groupedTasks),
      groupedEntity: groupByEntity
    }));

    const dstGroupId = destination?.droppableId !== source?.droppableId ? destination?.droppableId : null;
    const currentItemId = movedTask?.id;
    const nextItemId = destination.index - 1 >= 0 ? destinationItems[destination.index - 1]?.id : null;
    const previousItemId = destination.index + 1 < destinationItems.length ? destinationItems[destination.index + 1]?.id : null;

    const response = await handleSaveDnD(dstGroupId, currentItemId, nextItemId, previousItemId);

    if (response) {
      dispatch(setCurrentGroupedTaskList({
        list: (prevGroupedTasks => {
          const newDestinationItems = destinationItems.map(item =>
            item.id === response?.id ? response : item
          );

          const updatedGroups = [...prevGroupedTasks];
          updatedGroups[sourceGroupIndex] = { ...updatedGroups[sourceGroupIndex], items: sourceItems };
          if (sourceGroupIndex !== destinationGroupIndex) {
            updatedGroups[destinationGroupIndex] = {
              ...updatedGroups[destinationGroupIndex],
              items: newDestinationItems
            };
          }
          return updatedGroups;
        })(groupedTasks),
        groupedEntity: groupByEntity
      }));
    }
  };


  return (
    <Box
      pr={2}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Stack
          direction='row'
          spacing={1}
          sx={{ overflowX: 'auto' }}
          height={'100%'}
        >
          {groupedTasks?.map((gt, index) => (
            <Box key={index}>
              <StoreList {...gt} groupByEntity={gt} groupBy={groupByEntity} setOpenGroupByEntityDialog={setOpenGroupByEntityDialog} />
            </Box>
          ))}
        </Stack>
      </DragDropContext>
      <CustomTaskDialog />
    </Box>
  );
}

function StoreList({ id, name, projectId, items, isFromStart, isFromAny, groupByEntity, groupBy, setOpenGroupByEntityDialog }) {
  const theme = useTheme();
  const [collapse, setCollapse] = useState(false);
  const EditIcon = TablerIcon["IconEditCircle"];
  const CollapseIcon = TablerIcon["IconLayoutSidebarLeftCollapseFilled"];
  const ManageSettingIcon = TablerIcon["IconSettings"]
  const ColorIcon = TablerIcon["IconSquareRoundedFilled"];
  const currentMember = useSelector((state) => state.member.currentUserMember);
  const dispatch = useDispatch();


  const createTaskPermission = currentMember?.role?.projectPermissions?.includes("CREATE_TASKS");
  const editTaskPermission = currentMember?.role?.projectPermissions?.includes("EDIT_TASKS");
  const assignTaskPermission = currentMember?.role?.projectPermissions?.includes("ASSIGN_TASKS");

  const addTask = () => {
    console.log({
      open: true,
      props: {
        groupBy: groupBy,
        groupByEntity: groupByEntity
      }
    })
    dispatch(setAddTaskDialog({
      open: true,
      props: {
        groupBy: groupBy,
        groupByEntity: groupByEntity
      }
    }))
  }

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
              border: '1px solid',
              borderColor: snapshot.isDraggingOver ? theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.grey[600] : 'transparent',
              bgcolor: alpha((theme.palette.mode === "light" ? theme.palette.grey[300] : lighten(theme.palette.grey[900], 0.05)), 0.8)
            }}
          >
            <Card
              // bgcolor={alpha(groupByEntity?.customization?.backgroundColor, 0.3)}
              sx={{
                boxShadow: 0,
                borderRadius: 2,
                width: 320,
                mb: 1,
                p: 2,
                transform: collapse ? 'rotate(90deg) translateY(-100%)' : 'none',
                transformOrigin: '0 0',
                position: collapse ? 'absolute' : 'relative', // Apply absolute positioning when collapsed
                top: 0,
                left: 0,
                border: '1px solid',
                borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800]
              }}
            >
              <Stack
                direction='row'
                alignItems='center'
                spacing={2}
                maxWidth={320}
              >
                <ColorIcon size={12} color={groupByEntity?.customization?.backgroundColor} />
                <Box flexGrow={1}>
                  {groupBy == "assignee" && groupByEntity?.id != 0 ? groupByEntity?.user?.firstName + " " + groupByEntity?.user?.lastName : groupByEntity.name}
                </Box>
                {/* Action buttons */}
                <IconButton size="small" onClick={() => setCollapse(!collapse)}>
                  <CollapseIcon fontSize='inherit' stroke={2} size={18} />
                </IconButton>
              </Stack>
            </Card>
            {!collapse && (
              currentMember?.role?.projectPermissions?.includes("CREATE_TASKS") && (
                <Card
                  // bgcolor={alpha(groupByEntity?.customization?.backgroundColor, 0.3)}
                  sx={{
                    boxShadow: 0,
                    borderRadius: 2,
                    width: 320,
                    mb: 1,
                    border: '1px solid',
                    borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800]
                  }}
                >
                  {createTaskPermission && (
                    <IconButton
                      onClick={() => addTask()}
                      size='small'
                      sx={{
                        p: 2,
                        width: '100%',
                        borderRadius: 2
                      }}
                    >
                      <AddIcon fontSize='small' />
                    </IconButton>
                  )}

                </Card>
              ))}

            {!collapse && <Box
              height={`calc(100vh - ${theme.spacing(73)})`}
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
              <Stack spacing={1}>
                {items?.map((task, index) => (
                  <Draggable isDragDisabled={(!(groupBy != "assignee"  && editTaskPermission) || (groupBy == "assignee" && assignTaskPermission))} draggableId={task.id.toString()} index={index} key={task.id}>
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
