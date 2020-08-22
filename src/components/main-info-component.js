import {MONTH_NAMES} from '../const';
import {createElement} from '../utils';

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

export class MainInfo {
  constructor(data) {
    this._infoData = data;
    this._elem = null;
  }

  getTemplate() {
    return createMainInfoTemplate(this._infoData);
  }

  getElement() {
    if (!this._elem) {
      this._elem = createElement(this.getTemplate());
    }

    return this._elem;
  }

  removeElement() {
    this._elem = null;
  }
}
