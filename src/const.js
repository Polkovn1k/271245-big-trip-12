const TRANSFER_TYPE = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
];

const ACTIVITY_TYPE = [
  `check-in`,
  `sightseeing`,
  `restaurant`
];

const EVENT_DESTINATION = [
  `Chamonix`,
  `Geneva`,
  `Amsterdam`,
  `Helsinki`,
  `Oslo`,
  `Kopenhagen`,
  `Den Haag`,
  `Rotterdam`,
  `Saint Petersburg`,
  `Moscow`,
  `Sochi`,
  `Tokio`,
  `Kioto`,
  `Nagasaki`,
  `Hiroshima`,
  `Berlin`,
  `Munich`,
  `Frankfurt`,
  `Vien`,
  `Rome`,
  `Naples`,
  `Venice`,
  `Milan`,
  `Monaco`,
  `Paris`,
  `Barcelona`,
  `Valencia`,
  `Madrid`
];

const MONTH_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`,
];

const destinationTypeIcons = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`,
};

const RandomPriceSettings = {
  MIN_PRICE: 1000,
  MAX_PRICE: 10000,
  MULTIPLE: 10,
};

const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

const ItemSortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

const UserActionType = {
  UPDATE_TRIP: `UPDATE`,
  ADD_TRIP: `ADD`,
  DELETE_TRIP: `DELETE`,
};

const DataUpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

const FilterChangeType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};


export {
  TRANSFER_TYPE,
  ACTIVITY_TYPE,
  EVENT_DESTINATION,
  MONTH_NAMES,
  destinationTypeIcons,
  RandomPriceSettings,
  RenderPosition,
  ItemSortType,
  UserActionType,
  DataUpdateType,
  FilterChangeType,
  MenuItem,
};
