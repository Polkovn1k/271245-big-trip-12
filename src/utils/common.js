const getRandomItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomItemsFromArray = (arr, quantity) => {
  const randomItems = arr.map(() => getRandomItemFromArray(arr)).slice(0, quantity);

  return removeDuplicatesFromArray(randomItems);
};

const getRandom = (max, min = 1) => Math.random() * (max - min) + min;

const getRandomInt = (max, min = 1) => Math.floor(Math.random() * (max - min)) + min;

const removeDuplicatesFromArray = (arr) => Array.from(new Set(arr));

const getRandomNumberFromInterval = (min, max, mult) => Math.floor(Math.floor(Math.random() * (max - min + 1) + min) / mult) * mult;

const checkEventType = (type, arr) => {
  const isActivityType = arr.some((item) => item === type);

  return isActivityType ? `in` : `to`;
};

const updateItem = (array, updItem) => {
  const index = array.findIndex((item) => item.id === updItem.id);

  if (index === -1) {
    return array;
  }

  return [
    ...array.slice(0, index),
    updItem,
    ...array.slice(index + 1)
  ];
};

export {
  getRandomItemFromArray,
  getRandomItemsFromArray,
  getRandom,
  getRandomInt,
  removeDuplicatesFromArray,
  getRandomNumberFromInterval,
  checkEventType,
  updateItem,
};
