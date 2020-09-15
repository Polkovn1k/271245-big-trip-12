import {FilterChangeType} from "../const";

import Observer from "../utils/observer";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterChangeType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
