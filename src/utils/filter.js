import {FILTERTYPE} from "../const";

const filter = {
  [FILTERTYPE.EVERYTHING]: (eventDataList) => eventDataList.slice(),
  [FILTERTYPE.FUTURE]: (eventDataList) => eventDataList.filter((dataItem) => dataItem.date.startDate > Date.now()),
  [FILTERTYPE.PAST]: (eventDataList) => eventDataList.filter((dataItem) => dataItem.date.startDate < Date.now()),
};

export {
  filter,
};
