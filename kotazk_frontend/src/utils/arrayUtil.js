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


export const updateOrAddGroupedTasks = (groupedTasks, currentGroupedEntity, task) => {
  let taskFound = false;
  let previousGroupId = null;

  // Helper function to update or remove a task from its group
  const updateGroupItems = (group) => {
    const foundedTask = group.items.find(item => item.id === task.id);
    if (foundedTask) {
      const propertyId = task[currentGroupedEntity]?.id;
      const foundedPropertyId = foundedTask[currentGroupedEntity]?.id;

      if (propertyId && propertyId !== foundedPropertyId) {
        previousGroupId = group.id; // Record the current group to move the task
        return {
          ...group,
          items: group.items.filter(item => item.id !== task.id) // Remove task
        };
      } else {
        taskFound = true;
        return {
          ...group,
          items: group.items.map(item => (item.id === task.id ? { ...item, ...task } : item))
        };
      }
    }
    return group;
  };

  // Update groups by processing each group
  let updatedGroups = groupedTasks.map(updateGroupItems);

  // Add the task to the new group if it was moved
  if (previousGroupId !== null) {
    const targetGroup = updatedGroups.find(group => group.id === task[currentGroupedEntity]?.id);
    if (targetGroup) {
      updatedGroups = updatedGroups.map(group =>
        group.id === task[currentGroupedEntity].id
          ? { ...group, items: [...group.items, task] }
          : group
      );
    } else {
      console.warn(`Group with id ${task[currentGroupedEntity]?.id} not found.`);
    }
  } else if (!taskFound) {
    // Add the task to the correct group based on the currentGroupedEntity
    const targetGroup = updatedGroups.find(group => group.id === task[currentGroupedEntity]?.id);
    if (targetGroup) {
      updatedGroups = updatedGroups.map(group =>
        group.id === task[currentGroupedEntity].id
          ? { ...group, items: [...group.items, task] }
          : group
      );
    } else {
      console.warn(`Group with id ${task[currentGroupedEntity]?.id} not found. Task was not added.`);
    }
  }

  return updatedGroups;
};


export const removeGroupedItemById = (groupedTasks, itemId) => {
  return groupedTasks.map(group => ({
    ...group,
    items: group.items.filter(item => item.id !== itemId)
  }));
};

export const removeItemById = (itemsList, itemId) => {
  return itemsList.filter(item => item.id !== itemId);
};
