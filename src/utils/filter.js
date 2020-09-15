import {FilterChangeType} from "../const";

const filter = {
  [FilterChangeType.EVERYTHING]: (eventDataList) => eventDataList.slice(),
  [FilterChangeType.FUTURE]: (eventDataList) => eventDataList.filter((dataItem) => dataItem.date.startDate > Date.now()),
  [FilterChangeType.PAST]: (eventDataList) => eventDataList.filter((dataItem) => dataItem.date.startDate < Date.now()),
};

export {
  filter,
};
