export const randomInt = (min, max) => {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
};

export const setRandData = (data, totData) => {
  const totalData = [...totData];
  const currentData = [...data];
  const currentDataLength = currentData.length;
  const currentIndex = randomInt(0, currentDataLength - 1);

  if (totalData.indexOf(currentData[currentIndex]) !== -1) {
    return setRandData(currentData, totalData);
  }

  totalData.push(currentData[currentIndex]);
  currentData.splice(currentIndex, 1);

  if (currentData.length === 0) {
    return totalData;
  }

  return setRandData(currentData, totalData);
};
