import {MONTH_NAMES} from '../const';
import AbstractView from "./abstract.js";

const generateTitle = (array) => {
  if (array.length === 1) {
    return array[0].destinationName;
  }
  if (array.length === 2) {
    return `${array[0].destinationName} — ${array[1].destinationName}`;
  }

  return `${array[0].destinationName} — ... — ${array[array.length - 1].destinationName}`;
};

const generateDates = (array) => {
  const startMonth = MONTH_NAMES[new Date(array[0].date.startDate).getMonth()];
  const endMonth = MONTH_NAMES[new Date(array[array.length - 1].date.endDate).getMonth()];
  const startDate = array[0].date.startDate.getDate();
  const endDate = array[array.length - 1].date.endDate.getDate();

  return (startMonth === endMonth) ? `${startMonth} ${startDate} — ${endDate}` : `${startDate} ${startMonth} — ${endDate} ${endMonth}`;
};

const createMainInfoTemplate = (eventsArray) => {

  const sortedEvents = eventsArray
    .slice()
    .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate));

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${generateTitle(sortedEvents)}</h1>
      <p class="trip-info__dates">${generateDates(sortedEvents)}</p>
    </div>`
  );
};

export class MainInfo extends AbstractView {
  constructor(data) {
    super();
    this._infoData = data;
  }

  getTemplate() {
    return createMainInfoTemplate(this._infoData);
  }
}
