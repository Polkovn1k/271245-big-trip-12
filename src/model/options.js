export default class Options {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  setOptions(options) {
    this._destinations = options[0];
    this._offers = options[1];
  }

  getDestinations() {
    return this._destinations;
  }

  getOffers() {
    return this._offers;
  }
}
