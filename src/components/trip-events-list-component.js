import {createElement} from '../utils';

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export class TripEventList {
  constructor() {
    this._elem = null;
  }

  getTemplate() {
    return createTripEventsListTemplate();
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
