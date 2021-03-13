export const getStorage = (name) => {
  let dataStorage = localStorage.getItem(name);

  if (!dataStorage) {
    dataStorage = false;
  } else {
    dataStorage = JSON.parse(dataStorage);
  }

  return dataStorage;
};

export const saveStorage = (name, data) => {
  const json = JSON.stringify(data);

  localStorage.setItem(name, json);
};

export const deleteStorage = () => {
  localStorage.clear();
};
