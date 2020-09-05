import {RENDER_POSITION} from './const';

import Menu from './components/menu-component';
import Filter from './components/filter-component';
import TripsPresenter from './presenter/trip-list';

import TripModel from "./model/points.js";

import {generateTripEventsData} from "./mock-data/trip-event-item-data";
import {render} from './utils/render';

const TRIP_EVENT_ITEM_QUANTITY = 20;
const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);

const renderTripMainControls = () => {
  const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
  const tripMainControlsTitle = tripMain.querySelector(`.trip-main__trip-controls h2:first-child`);

  render(tripMainControls, new Filter(), RENDER_POSITION.BEFOREEND);
  render(tripMainControlsTitle, new Menu(), RENDER_POSITION.AFTEREND);
};

const tripEventItems = generateTripEventsData(TRIP_EVENT_ITEM_QUANTITY)
  .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate));

const tripModel = new TripModel();
tripModel.setTrips(tripEventItems);

const mainTripPresenter = new TripsPresenter(tripEvents, tripModel);

renderTripMainControls();
mainTripPresenter.init();
console.dir(tripEventItems);
