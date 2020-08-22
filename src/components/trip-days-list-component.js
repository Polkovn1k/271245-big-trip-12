import {createElement} from '../utils';

const createTripDaysListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export class TripDaysList {
  constructor() {
    this._elem = null;
  }

  getTemplate() {
    return createTripDaysListTemplate();
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
