export const updateAndAddArray = (A, B) => {
  // Update existing items in A with items from B
  const updatedA = A.map(itemA => {
    const matchingItemB = B.find(itemB => itemB.id === itemA.id);
    return matchingItemB || itemA;
  });

  // Get new items from B that are not in A
  const newItemsFromB = B.filter(itemB => !A.some(itemA => itemA.id === itemB.id));

  // Combine updatedA and newItemsFromB
  const combinedArray = [...updatedA, ...newItemsFromB];

  // Sort the combined array by the position field
  combinedArray.sort((a, b) => a.position - b.position);

  return combinedArray;
};
