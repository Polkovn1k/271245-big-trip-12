import {TRANSFER_TYPE, ACTIVITY_TYPE, EVENT_DESTINATION} from '../const';

import SmartView from "./smart.js";

import {datePicker} from "./date-picker";

import {checkEventType} from '../utils/common';
import {formatTime, castTimeFormat} from '../utils/date-time';
import {generateTripEventOfferData} from '../mock-data/trip-event-offer-data';
import {generateTripEventDestinationData} from "../mock-data/trip-event-destination-data";

const generatePhoto = (imgSrcArr, destinationName) => {
  return imgSrcArr
    .map((item, i) => (`<img class="event__photo" src="${item}" alt="${destinationName} - photo №${i + 1}">`))
    .join(`\n`);
};

const generateEventTypeItems = (eventTypes, type) => {
  return eventTypes
    .map((item) => (
      `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${type === item ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${item}</label>
      </div>`))
    .join(`\n`);
};

const getEventOfferSelecterTemplate = (offerData) => {
  return offerData
    .map((item, i) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" data-id="${i}" id="event-offer-luggage-${i}" type="checkbox" name="event-offer-luggage" ${item.checked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-luggage-${i}">
          <span class="event__offer-title">${item.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
        </label>
      </div>`))
    .join(`\n`);
};

const getDateString = (dateObj) => {
  const day = dateObj.getDate();
  const month = castTimeFormat(dateObj.getMonth() + 1);
  const year = String(dateObj.getFullYear()).slice(2);

  return `${day}/${month}/${year}`;
};

const generateOptions = (optValue) => {
  return optValue
    .map((item) => (`<option value="${item}"></option>`))
    .join(`\n`);
};

const createEventEditTemplate = (objData) => {
  const {type, destinationName, offers, destinationInfo, price, date, isFavorite} = objData;
  const favoriteStatus = isFavorite ? `checked` : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${generateEventTypeItems(TRANSFER_TYPE, type)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${generateEventTypeItems(ACTIVITY_TYPE, type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type} ${checkEventType(type, ACTIVITY_TYPE)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${generateOptions(EVENT_DESTINATION)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateString(date.startDate)} ${formatTime(date.startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateString(date.endDate)} ${formatTime(date.endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteStatus}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

      </header>

      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${getEventOfferSelecterTemplate(offers)}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationInfo.destinationDescription.join(` `)}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${generatePhoto(destinationInfo.destinationPhoto, destinationName)}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class TripEventEditItem extends SmartView  {
  constructor(data) {
    super();
    this._data = data;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._datePicker = datePicker.bind(this);

    this._setInnerHandlers();
    this._datePicker();
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._datePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFavoriteChangeHandler(this._callback.favoriteChange);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.event__offer-checkbox`)
      .forEach((item) => {
        item.addEventListener(`change`, this._offersChangeHandler);
      });

    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((item) => {
        item.addEventListener(`change`, this._eventTypeChangeHandler);
      });

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);

    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.value === this._data.type) {
      return;
    }
    this.updateData({
      type: evt.target.value,
      offers: generateTripEventOfferData()[evt.target.value],
    });
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    let offers = this._data.offers.map((item, i) => {
      if (+evt.currentTarget.dataset.id === i) {
        item.checked = evt.currentTarget.checked;
      }
      return item;
    });
    this.updateData({
      offers,
    });
  }

  _startDateChangeHandler(startDate) {
    let date = Object.assign(
      {},
      {
        startDate: new Date(startDate),
        endDate: this._data.date.endDate > new Date(startDate)
          ? this._data.date.endDate
          : new Date(new Date(startDate).getTime() + 3600000),
      }
    );
    this.updateData({
      date,
    });
  }

  _endDateChangeHandler(endDate) {
    let date = Object.assign(
      {},
      {
        endDate: new Date(endDate),
        startDate: this._data.date.startDate < new Date(endDate)
          ? this._data.date.startDate
          : new Date(new Date(endDate).getTime() - 3600000),
      }
    );
    this.updateData({
      date,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const isRightValue = EVENT_DESTINATION.some((item) => evt.target.value === item);

    this.updateData({
      destinationName: isRightValue ? evt.target.value : this._data.destinationName,
      destinationInfo: generateTripEventDestinationData(),
    });
  }

  _priceInputHandler(evt) {
    let value = Number.parseInt(evt.target.value);
    if (isNaN(value)) {
      return;
    }
    this.updateData({
      price: value,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.favoriteChange = callback;
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, this._favoriteChangeHandler);
  }
}
