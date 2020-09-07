import {RENDER_POSITION} from './const';

import Menu from './components/menu-component';
import Filter from './components/filter-component';

import TripsPresenter from './presenter/trip-list';
import FilterPresenter from "./presenter/filter";

import TripModel from "./model/points";
import FilterModel from "./model/filter";

import {generateTripEventsData} from "./mock-data/trip-event-item-data";
import {render} from './utils/render';

const TRIP_EVENT_ITEM_QUANTITY = 20;
const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
const tripMainControlsTitle = tripMain.querySelector(`.trip-main__trip-controls h2:first-child`);

const tripEventItems = generateTripEventsData(TRIP_EVENT_ITEM_QUANTITY)
  .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate));

const tripModel = new TripModel();
const filterModel = new FilterModel();

tripModel.setTrips(tripEventItems);

const mainTripPresenter = new TripsPresenter(tripEvents, tripModel, filterModel);
const filterPresenter = new FilterPresenter(tripMainControls, filterModel, tripModel);

render(tripMainControlsTitle, new Menu(), RENDER_POSITION.AFTEREND);

filterPresenter.init();
mainTripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  mainTripPresenter.createTrip();
});

console.dir(tripEventItems);
