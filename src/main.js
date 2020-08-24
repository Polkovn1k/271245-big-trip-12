import {RENDER_POSITION} from './const';
import {render} from './utils/render';
import InfoContainer from './components/info-container-component';
import MainInfo from './components/main-info-component';
import Cost from './components/cost-component';
import Menu from './components/menu-component';
import Filter from './components/filter-component';
import TripPresenter from './presenter/trip';
import {generateTripEventsData} from "./mock-data/trip-event-item-data";

const TRIP_EVENT_ITEM_QUANTITY = 20;
const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsTitle = tripEvents.querySelector(`.trip-events h2:first-child`);

const renderInfo = (infoData) => {
  const infoContainer = new InfoContainer();
  render(tripMain, infoContainer, RENDER_POSITION.AFTERBEGIN);
  render(infoContainer, new Cost(), RENDER_POSITION.BEFOREEND);
  if (infoData.length) {
    render(tripMain, new MainInfo(infoData), RENDER_POSITION.AFTERBEGIN);
  }
};

const renderTripMainControls = () => {
  const tripMainControls = tripMain.querySelector(`.trip-main__trip-controls`);
  const tripMainControlsTitle = tripMain.querySelector(`.trip-main__trip-controls h2:first-child`);

  render(tripMainControls, new Filter(), RENDER_POSITION.BEFOREEND);
  render(tripMainControlsTitle, new Menu(), RENDER_POSITION.AFTEREND);
};



const tripEventItems = generateTripEventsData(TRIP_EVENT_ITEM_QUANTITY)
  .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate));

const mainTripPresenter = new TripPresenter(tripEvents);

renderTripMainControls();
renderInfo(tripEventItems);
mainTripPresenter.init(tripEventItems);
console.dir(tripEventItems);
