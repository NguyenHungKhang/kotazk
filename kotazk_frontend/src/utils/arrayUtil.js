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


export const modifyTaskInGroupedTasks = (taskId, groupedTasks, newTaskData) => {
  return groupedTasks.map(group => {
    const taskIndex = group.items.findIndex(item => item.id === taskId);
    if (taskIndex !== -1) {
      return {
        ...group,
        items: group.items.map((item, index) =>
          index === taskIndex ? { ...item, ...newTaskData } : item
        )
      };
    }
    return group;
  });
};