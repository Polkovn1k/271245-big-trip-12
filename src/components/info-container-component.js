import {createElement} from '../utils';

const createInfoContainerTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info"></section>`
  );
};

export class InfoContainer {
  constructor() {
    this._elem = null;
  }

  getTemplate() {
    return createInfoContainerTemplate();
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
