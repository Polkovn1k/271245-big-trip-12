import {RenderPosition, MenuItem, DataUpdateType, FilterChangeType} from './const';

import Menu from './components/menu-component';
import Statistics from "./components/statistics";

import TripsPresenter from './presenter/trip-list';
import FilterPresenter from "./presenter/filter";

import TripModel from "./model/points";
import FilterModel from "./model/filter";

import Api from "./api/api";

import {render, remove} from './utils/render';

const AUTHORIZATION = `Basic qw34dfgfg34j`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);
const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
const tripMainControlsTitle = tripMain.querySelector(`.trip-main__trip-controls h2:first-child`);
const addNewEventBtn = document.querySelector(`.trip-main__event-add-btn`);

const api = new Api(END_POINT, AUTHORIZATION);

api.getTrip()
  .then((eventDataList) => {
    tripModel.setTrips(DataUpdateType.INIT, eventDataList);
  })
  .catch(() => {
    tripModel.setTrips(DataUpdateType.INIT, []);
  });

const tripModel = new TripModel();
const filterModel = new FilterModel();

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
      mainTripPresenter.init();
      addNewEventBtn.removeAttribute(`disabled`);
      break;
    case MenuItem.STATS:
      mainTripPresenter.destroy({onlyMainList: true});
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
  mainTripPresenter.init();
  mainTripPresenter.createTrip();
});
