import {MenuItem} from "../const.js";

import AbstractView from "./abstract.js";

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn" href="#">${MenuItem.STATS}</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName.toLowerCase() !== `a` || evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    this.getElement()
      .querySelectorAll(`.trip-tabs__btn`)
      .forEach((item) => {
        item.classList.remove((`trip-tabs__btn--active`))
      });
    evt.target.classList.add(`trip-tabs__btn--active`);
    this._callback.menuClick(evt.target.innerHTML);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  /*setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }*/
}
