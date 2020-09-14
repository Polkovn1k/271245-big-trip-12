import {getDurationDate} from "./date-time";

const calcPrice = (eventDataList, type) => {
  let priceSum = 0;
  const price = eventDataList.reduce((acc, item) => {
    if (item.type === type) {
      priceSum += parseInt(item.price, 10);
      acc[item.type] = priceSum;
    }
    return acc;
  }, {});
  return price[type];
};

const calcTimeSpent = (eventDataList, type) => {
  let timeSum = 0;
  const time = eventDataList.reduce((acc, item) => {
    if (item.type === type) {
      const durationTime = getDurationDate(item.date.startDate, item.date.endDate);
      timeSum += durationTime.asHours();
      acc[item.type] = Math.round(timeSum);
    }
    return acc;
  }, {});
  return time[type];
};

export {
  calcPrice,
  calcTimeSpent,
};
