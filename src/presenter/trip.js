import {RENDER_POSITION, SORT_TYPE} from '../const';
import {render, replace} from '../utils/render';
import Sort from '../components/sort-component';
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
    this._currentSortType = SORT_TYPE.EVENT;

    this._sortComponent = new Sort();
    this._tripDaysListComponent = new TripDaysList();
    this._noPointsComponent = new NoPoints();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _sortData(sortType) {
    switch (sortType) {
      case SORT_TYPE.EVENT:
        this._data = this._sourcedData.slice();
        break;
      case SORT_TYPE.TIME:
        this._data.sort((a, b) => (new Date(b.date.endDate) - new Date(b.date.startDate)) - (new Date(a.date.endDate) - new Date(a.date.startDate)));
        break;
      case SORT_TYPE.PRICE:
        this._data.sort((a, b) => b.price - a.price);
        break;
    }
    this._currentSortType = sortType;
  };

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortData(sortType);
    this._clearTripList();
    this._sortComponent.getElement().querySelector(`#${sortType}`).checked = true;
    if (this._currentSortType === SORT_TYPE.EVENT) {
      this._renderTripDaysList();
    } else {
      this._renderTripList();
    }
  }

  _clearTripList() {
    this._tripDaysListComponent.getElement().innerHTML = ``;
  }

  _renderSort() {
    render(this._container, this._sortComponent, RENDER_POSITION.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

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

  _renderTripList() {
    render(this._tripDaysListComponent, new TripDaysItem(), RENDER_POSITION.BEFOREEND);
    const container = this._container.querySelector(`.trip-days__item`);
    this._renderTripDaysItem(container, this._data);
  }

  _renderTripDaysItem(container, data, tripDay) {
    const eventList = new TripEventList();
    console.dir(container);
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

    this._renderSort();
    render(this._container, this._tripDaysListComponent, RENDER_POSITION.BEFOREEND);
    this._renderTripDaysList();
  }

  init(data) {
    this._data = data.slice();
    this._sourcedData = data.slice();

    this._renderMainRender();
  }
}
