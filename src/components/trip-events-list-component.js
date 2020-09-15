import AbstractView from "./abstract";

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export default class TripEventList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
