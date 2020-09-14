import {RenderPosition, MenuItem, DataUpdateType, FilterChangeType} from './const';

import Menu from './components/menu-component';
import Statistics from "./components/statistics";

import TripsPresenter from './presenter/trip-list';
import FilterPresenter from "./presenter/filter";

import TripModel from "./model/points";
import FilterModel from "./model/filter";

import {generateTripEventsData} from "./mock-data/trip-event-item-data";
import {render, remove} from './utils/render';

const TRIP_EVENT_ITEM_QUANTITY = 20;
const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
const tripMainControlsTitle = tripMain.querySelector(`.trip-main__trip-controls h2:first-child`);
const addNewEventBtn = document.querySelector(`.trip-main__event-add-btn`);

const tripEventItems = generateTripEventsData(TRIP_EVENT_ITEM_QUANTITY)
  .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate));

const tripModel = new TripModel();
const filterModel = new FilterModel();

tripModel.setTrips(tripEventItems);

const mainTripPresenter = new TripsPresenter(tripEvents, tripModel, filterModel);
const filterPresenter = new FilterPresenter(tripMainControls, filterModel, tripModel);

const siteMenuComponent = new Menu();

render(tripMainControlsTitle, siteMenuComponent, RenderPosition.AFTEREND);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      mainTripPresenter.destroy();
      mainTripPresenter.init(true);
      addNewEventBtn.removeAttribute(`disabled`);
      break;
    case MenuItem.STATS:
      mainTripPresenter.destroy();
      statisticsComponent = new Statistics(tripModel.getTrips());
      render(tripEvents, statisticsComponent, RenderPosition.AFTEREND);
      addNewEventBtn.disabled = true;
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
mainTripPresenter.init();

addNewEventBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  evt.currentTarget.disabled = true;
  remove(statisticsComponent);
  mainTripPresenter.destroy();
  filterModel.setFilter(DataUpdateType.MAJOR, FilterChangeType.EVERYTHING);
  mainTripPresenter.init(true);
  mainTripPresenter.createTrip();
});
