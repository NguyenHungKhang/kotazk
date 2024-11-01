export const updateAndAddArray = (A, B) => {
  const updatedA = A.map(itemA => {
    const matchingItemB = B.find(itemB => itemB.id === itemA.id);
    return matchingItemB || itemA;
  });

  const newItemsFromB = B.filter(itemB => !A.some(itemA => itemA.id === itemB.id));
  const combinedArray = [...updatedA, ...newItemsFromB];
  combinedArray.sort((a, b) => a.position - b.position);

  return combinedArray;
};


export const updateOrAddGroupedTasks = (groupedTasks, task) => {
  let taskFound = false;

  // Iterate through each group in groupedTasks
  const updatedGroups = groupedTasks.map(group => {
    const taskIndex = group.items.findIndex(item => item.id === task.id);

    if (taskIndex !== -1) {
      // Update the task if found
      taskFound = true;
      return {
        ...group,
        items: group.items.map(item => (item.id === task.id ? { ...item, ...task } : item))
      };
    }

    return group;
  });

  // If task wasn't found, add it to the first group (or any other rule you define)
  if (!taskFound && updatedGroups.length > 0) {
    updatedGroups[0] = {
      ...updatedGroups[0],
      items: [...updatedGroups[0].items, task]
    };
  }

  return updatedGroups;
};
