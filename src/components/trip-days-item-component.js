import {formatDate} from '../utils/common';
import AbstractView from "./abstract.js";

const createTripDaysItemTemplate = (tripDay, count) => {
  const date = tripDay ? formatDate(new Date(tripDay)) : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${tripDay}">${date}</time>
      </div>
    </li>`
  );
};

export default class TripDaysItem extends AbstractView {
  constructor(data, count) {
    super();
    this._tripDaysItemData = data || ``;
    this._count = count || ``;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._tripDaysItemData, this._count);
  }
}
