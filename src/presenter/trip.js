import {RENDER_POSITION} from '../const';
import {render, replace} from '../utils/render';
import Sort, {SORT_TYPE} from '../components/sort-component';
import TripEventItem from '../components/trip-event-item-component';
import TripEventEditItem from '../components/event-edit-component';
import TripDaysList from '../components/trip-days-list-component';
import TripDaysItem from '../components/trip-days-item-component';
import TripEventList from '../components/trip-events-list-component';
import NoPoints from '../components/no-points-component';
import {generateTripDays, getTripDaysString} from "../mock-data/trip-event-date-data";

export default class Trip {
  constructor(container) {
    this._container = container;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._noPointsComponent = new NoPoints();
  }

  _renderSort() {}

  _renderTripEventItem(eventsContainer, data) {
    const tripEventItem = new TripEventItem(data);
    const tripEventEditItem = new TripEventEditItem(data);

    const replaceEventToEdit = () => {
      replace(tripEventEditItem, tripEventItem);
    };

    const replaceEditToEvent = () => {
      replace(tripEventItem, tripEventEditItem);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    tripEventItem.setRollupClickHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    tripEventEditItem.setFormSubmitHandler(() => {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventsContainer, tripEventItem, RENDER_POSITION.BEFOREEND);
  }

  _renderTripDaysList() {
    const tripDays = generateTripDays(this._data);
    tripDays.forEach((item, i) => {
      render(this._tripDaysListComponent, new TripDaysItem(item, i + 1), RENDER_POSITION.BEFOREEND);
    });

    const tripDaysItem = this._container.querySelectorAll(`.trip-days__item`);
    tripDaysItem.forEach((tripDayItem, i) => {
      this._renderTripDaysItem(tripDayItem, this._data, tripDays[i]);
    });
  }

  _renderTripDaysItem(container, data, tripDay) {
    const eventList = new TripEventList();
    render(container, eventList, RENDER_POSITION.BEFOREEND);
    const dataList = tripDay ?
      data.slice().filter((eventItem) => getTripDaysString(eventItem) === tripDay) :
      data.slice();

    dataList.forEach((currentDayEvent) => {
      this._renderTripEventItem(eventList, currentDayEvent);
    });
  }

  _renderNoPoints() {
    render(this._container, this._noPointsComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderMainRender() {
    if (!this._data.length) {
      this._renderNoPoints();
      return;
    }

    render(this._container, this._sortComponent, RENDER_POSITION.BEFOREEND);
    render(this._container, this._tripDaysListComponent, RENDER_POSITION.BEFOREEND);
    this._renderTripDaysList();
  }

  init(data) {
    this._data = data.slice();
    this._sourcedData = data.slice();

    this._renderMainRender();
  }
}
