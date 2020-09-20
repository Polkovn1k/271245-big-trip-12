import TripModel from "../model/points";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getAllTripData() {
    return Promise.all([
      this.getTrip(),
      this.getDestinations(),
      this.getOffers(),
    ])
      .then((arr) => {
        return {
          tripData: arr[0],
          optionsData: {
            destination: arr[1],
            offers: arr[2],
          },
        };
      });
  }

  getTrip() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((eventsData) => eventsData.map(TripModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON)
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON)
  }

  updateTrip(eventData) {
    return this._load({
      url: `points/${eventData.id}`,
      method: Method.PUT,
      body: JSON.stringify(TripModel.adaptToServer(eventData)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((eventsData) => TripModel.adaptToClient(eventsData));
  }

  addTrip(eventData) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(TripModel.adaptToServer(eventData)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(TripModel.adaptToClient);
  }

  deleteTrip(eventData) {
    return this._load({
      url: `points/${eventData.id}`,
      method: Method.DELETE
    });
  }

  _load({
          url,
          method = Method.GET,
          body = null,
          headers = new Headers()
        }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
