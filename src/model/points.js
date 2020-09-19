import Observer from "../utils/observer";

export default class Points extends Observer {
  constructor() {
    super();
    this._trips = [];
  }

  setTrips(updateType, trips) {
    this._trips = trips.slice();
    this._notify(updateType);
  }

  getTrips() {
    return this._trips;
  }

  updateTrip(updateType, update) {
    const index = this._trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting trip`);
    }

    this._trips = [
      ...this._trips.slice(0, index),
      update,
      ...this._trips.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addTrip(updateType, update) {
    this._trips = [
      update,
      ...this._trips
    ];

    this._notify(updateType, update);
  }

  deleteTrip(updateType, update) {
    const index = this._trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting trip`);
    }

    this._trips = [
      ...this._trips.slice(0, index),
      ...this._trips.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(eventData) {
    const adaptedEventData = Object.assign(
      {},
      eventData,
      {
        id: +eventData.id,
        isFavorite: eventData.is_favorite,
        destinationName: eventData.destination.name,
        destinationInfo: {
          destinationDescription: eventData.destination.description,
          destinationPhoto: eventData.destination.pictures,
        },
        price: eventData.base_price,
        type: eventData.type,
        date: {
          endDate: new Date(eventData.date_from),
          startDate: new Date(eventData.date_to),
        },
        addMode: false,
      }
    );

    delete adaptedEventData.base_price;
    delete adaptedEventData.date_from;
    delete adaptedEventData.date_to;
    delete adaptedEventData.destination;
    delete adaptedEventData.is_favorite;

    return adaptedEventData;
  }

  static adaptToServer(eventData) {
    const adaptedEventData = Object.assign(
      {},
      eventData,
      {
        "base_price": eventData.price,
        "date_from": eventData.date.startDate,
        "date_to": eventData.date.endDate,
        "destination": {
          description: eventData.destinationInfo.destinationDescription,
          name: eventData.destinationName,
          pictures: eventData.destinationInfo.destinationPhoto,
        },
        "id": `${eventData.id}`,
        "is_favorite": eventData.isFavorite,
        "offers": eventData.offers,
        "type": eventData.type,
      }
    );

    delete adaptedEventData.addMode;
    delete adaptedEventData.date;
    delete adaptedEventData.destinationInfo;
    delete adaptedEventData.destinationName;
    delete adaptedEventData.isFavorite;
    delete adaptedEventData.price;

    return adaptedEventData;
  }
}
