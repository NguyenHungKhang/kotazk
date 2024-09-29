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
