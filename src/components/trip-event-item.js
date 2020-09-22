import {ACTIVITY_TYPES} from "../const";

import AbstractView from "./abstract";

import {checkEventType} from "../utils/common";
import {formatTime, timeDuration} from "../utils/date-time";

const MIN_OFFERS = 0;
const MAX_OFFERS = 3;

const getEventSelectedOffersTemplate = (offerData) => {
  return offerData
    .filter((item) => item.checked)
    .slice(MIN_OFFERS, MAX_OFFERS)
    .map((item) => (
      `<li class="event__offer">
        <span class="event__offer-title">${item.title}</span>
        &plus; &euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </li>`))
    .join(`\n`);
};

const createTripEventItemTemplate = (obj) => {
  const {type, destinationName, offers, price, date} = obj;
  const eventDuration = timeDuration(date.startDate, date.endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${checkEventType(type, ACTIVITY_TYPES)} ${destinationName}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${formatTime(date.startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${formatTime(date.endDate)}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${getEventSelectedOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEventItem extends AbstractView {
  constructor(data) {
    super();
    this._tripEventItemData = data;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventItemTemplate(this._tripEventItemData);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupClickHandler);
  }
}
