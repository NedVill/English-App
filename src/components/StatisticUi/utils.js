const sortMethods = {
  sortAplphabet(keys, object, prop, mode) {
    const arr = keys.sort((a, b) => {
      if (mode === 1) {
        return object[b][prop].toLowerCase() < object[a][prop].toLowerCase() ? -1 : 0;
      }

      return object[b][prop].toLowerCase() > object[a][prop].toLowerCase() ? -1 : 0;
    });

    return arr;
  },
  sortNumeric(keys, object, prop, mode) {
    const arr = keys.sort((a, b) => {
      if (mode === 1) {
        return object[a][prop] - object[b][prop];
      }

      return object[b][prop] - object[a][prop];
    });

    return arr;
  },
};

export const sortObject = (object, prop, mode = 0) => {
  const newObject = {};
  const objKeys = Object.keys(object);
  const method = Number.isNaN(parseFloat(object[objKeys['0']][prop])) ? 'sortAplphabet' : 'sortNumeric';
  const keys = sortMethods[method](objKeys, object, prop, mode);

  keys.forEach((key) => {
    newObject[key] = { ...object[key] };
  });

  return newObject;
};

export const getSort = (item, data) => {
  const prop = item.textContent.toLocaleLowerCase();
  const activeElem = document.querySelector('.result-table__active');
  let sortData = { ...data };
  let sortKey = item.getAttribute('data-sort');

  if (sortKey === '') {
    sortKey = 1;
  }

  sortKey = +sortKey === 0 ? 1 : 0;
  sortData = sortObject(sortData, prop, sortKey);

  if (activeElem) {
    activeElem.classList.remove('result-table__active');
  }

  item.setAttribute('data-sort', sortKey);
  item.classList.add('result-table__active');

  return sortData;
};
