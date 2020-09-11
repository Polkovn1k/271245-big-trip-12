import {filterChangeType} from "../const";

const filter = {
  [filterChangeType.EVERYTHING]: (eventDataList) => eventDataList.slice(),
  [filterChangeType.FUTURE]: (eventDataList) => eventDataList.filter((dataItem) => dataItem.date.startDate > Date.now()),
  [filterChangeType.PAST]: (eventDataList) => eventDataList.filter((dataItem) => dataItem.date.startDate < Date.now()),
};

export {
  filter,
};
