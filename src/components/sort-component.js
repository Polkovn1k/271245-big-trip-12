import {SORT_TYPE} from '../const';
import AbstractView from "./abstract.js";

const createSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="${SORT_TYPE.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.EVENT}" checked>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="${SORT_TYPE.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.TIME}">
        <label class="trip-sort__btn" for="sort-time">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="${SORT_TYPE.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SORT_TYPE.PRICE}">
        <label class="trip-sort__btn" for="sort-price">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._currentSortType = SORT_TYPE.EVENT;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName.toLowerCase() !== `label`) {
      return;
    }

    this._callback.sortTypeChange(evt.target.htmlFor);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

export {SORT_TYPE};