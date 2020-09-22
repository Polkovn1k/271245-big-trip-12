import moment from "moment";

const checkEventType = (type, arr) => {
  const isActivityType = arr.some((item) => item === type);

  return isActivityType ? `in` : `to`;
};

const getTripDaysString = (item) => (`${moment(item.date.startDate).format(`YYYY-M-D`)}`);

const generateTripDays = (eventArr) => {
  const tripDays = eventArr
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
