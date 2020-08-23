import AbstractView from "./abstract.js";

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export class TripEventList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
