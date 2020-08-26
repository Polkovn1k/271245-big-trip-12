import {MONTH_NAMES} from '../const';
import AbstractView from "./abstract.js";

const createTripDaysItemTemplate = (tripDay = ``, count = ``) => {
  const month = tripDay ? MONTH_NAMES[new Date(tripDay).getMonth()] : ``;
  const dateNum = tripDay ? new Date(tripDay).getDate() : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${tripDay}">${month} ${dateNum}</time>
      </div>
    </li>`
  );
};

export default class TripDaysItem extends AbstractView {
  constructor(data, count) {
    super();
    this._tripDaysItemData = data;
    this._count = count;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._tripDaysItemData, this._count);
  }
}
