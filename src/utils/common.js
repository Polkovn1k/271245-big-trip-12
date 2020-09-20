const checkEventType = (type, arr) => {
  const isActivityType = arr.some((item) => item === type);

  return isActivityType ? `in` : `to`;
};

const getTripDaysString = (item) => (`${item.date.startDate.getFullYear()}-${item.date.startDate.getMonth() + 1}-${item.date.startDate.getDate()}`);

const generateTripDays = (eventArr) => {
  let tripDays = eventArr
    .slice()
    .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate))
    .map((item) => getTripDaysString(item));

  return [...new Set(tripDays)];
};

export {
  checkEventType,
  generateTripDays,
  getTripDaysString,
};
