import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, Button, Box } from "@mui/material";

const DependencyComponent = () => {
  const [selectBoxes, setSelectBoxes] = useState([
    { dependencyType: "", selectedTask: "" },
  ]);

  const tasks = [
    { id: 1, name: "Task 1" },
    { id: 2, name: "Task 2" },
    { id: 3, name: "Task 3" },
  ];

  const handleAddSelectBox = () => {
    setSelectBoxes([...selectBoxes, { dependencyType: "", selectedTask: "" }]);
  };

  const handleDependencyChange = (index, value) => {
    const updatedBoxes = [...selectBoxes];
    updatedBoxes[index].dependencyType = value;
    setSelectBoxes(updatedBoxes);
  };

  const handleTaskChange = (index, value) => {
    const updatedBoxes = [...selectBoxes];
    updatedBoxes[index].selectedTask = value;
    setSelectBoxes(updatedBoxes);
  };

  return (
    <Box sx={{ p: 2 }}>
      {selectBoxes.map((box, index) => (
        <Box
          key={index}
          sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
        >
          {/* Dependency Type Select */}
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel id={`dependency-type-label-${index}`}>
              Dependency Type
            </InputLabel>
            <Select
              labelId={`dependency-type-label-${index}`}
              value={box.dependencyType}
              onChange={(e) => handleDependencyChange(index, e.target.value)}
            >
              <MenuItem value="Blocking">Blocking</MenuItem>
              <MenuItem value="Blocked By">Blocked By</MenuItem>
            </Select>
          </FormControl>

          {/* Task List Select */}
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel id={`task-list-label-${index}`}>Select Task</InputLabel>
            <Select
              labelId={`task-list-label-${index}`}
              value={box.selectedTask}
              onChange={(e) => handleTaskChange(index, e.target.value)}
            >
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}

      {/* Add Button */}
      <Button variant="contained" color="primary" onClick={handleAddSelectBox}>
        Add
      </Button>
    </Box>
  );
};

export default DependencyComponent;
