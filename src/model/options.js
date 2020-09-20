import Observer from "../utils/observer";

export default class Options extends Observer {
  constructor() {
    super();
    this._destinations = [];
    this._offers = [];
  }

  setOptions(updateType, options) {
    this._destinations = options.destination;
    this._offers = options.offers;
    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }

  getOffers() {
    return this._offers;
  }
}
