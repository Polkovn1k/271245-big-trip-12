import {RENDER_POSITION, SORT_TYPE, UPDATETYPE, USERACTION} from '../const';

import Sort from '../components/sort-component';
import TripPresenter from './trip';
import TripDaysList from '../components/trip-days-list-component';
import TripDaysItem from '../components/trip-days-item-component';
import TripEventList from '../components/trip-events-list-component';
import NoPoints from '../components/no-points-component';

import {generateTripDays, getTripDaysString} from "../mock-data/trip-event-date-data";
import {render, remove} from '../utils/render';
import InfoContainer from "../components/info-container-component";
import Cost from "../components/cost-component";
import MainInfo from "../components/main-info-component";

export default class Trip {
  constructor(container, tripModel) {
    this._tripModel = tripModel;
    this._container = container;
    this._currentSortType = SORT_TYPE.EVENT;
    this._tripPresenterObserver = {};

    this._sortComponent = null;
    this._tripDaysListComponent = new TripDaysList();
    this._noPointsComponent = new NoPoints();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._tripModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderMainRender();
    this._renderInfo();
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    switch (actionType) {
      case USERACTION.UPDATE_TRIP:
        this._tripModel.updateTrip(updateType, update);
        break;
      case USERACTION.ADD_TRIP:
        this._tripModel.addTrip(updateType, update);
        break;
      case USERACTION.DELETE_TRIP:
        this._tripModel.deleteTrip(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    switch (updateType) {
      case UPDATETYPE.PATCH:
        this._tripPresenterObserver[data.id].init(data);
        break;
      case UPDATETYPE.MINOR:
        this._clearMainTripList();
        this._renderMainRender();
        break;
      case UPDATETYPE.MAJOR:
        this._clearMainTripList({resetSortType: true});
        this._renderMainRender();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainTripList();
    this._renderMainRender();
    this._sortComponent.getElement().querySelector(`#${sortType}`).checked = true;
  }

  _getTripsData() {
    switch (this._currentSortType) {
      case SORT_TYPE.TIME:
        return this._tripModel.getTrips().slice().sort((a, b) => (new Date(b.date.endDate) - new Date(b.date.startDate)) - (new Date(a.date.endDate) - new Date(a.date.startDate)));
      case SORT_TYPE.PRICE:
        return this._tripModel.getTrips().slice().sort((a, b) => b.price - a.price);
    }
    return this._tripModel.getTrips();
  }

  _handleModeChange() {
    Object
      .values(this._tripPresenterObserver)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._container, this._sortComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderTripEventItem(eventsContainer, currentDayEvent) {
    const tripPresenter = new TripPresenter(eventsContainer, this._handleViewAction, this._handleModeChange);
    tripPresenter.init(currentDayEvent);
    this._tripPresenterObserver[currentDayEvent.id] = tripPresenter;
  }

  _renderTrips() {
    if (this._currentSortType === SORT_TYPE.EVENT) {
      this._renderTripDaysList();
    } else {
      this._renderTripList();
    }
  }

  _renderTripDaysList() {
    const tripDays = generateTripDays(this._getTripsData());
    tripDays.forEach((item, i) => {
      render(this._tripDaysListComponent, new TripDaysItem(item, i + 1), RENDER_POSITION.BEFOREEND);
    });

    const tripDaysItem = this._container.querySelectorAll(`.trip-days__item`);
    tripDaysItem.forEach((tripDayItem, i) => {
      this._renderTripDaysItem(tripDayItem, this._getTripsData(), tripDays[i]);
    });
  }

  _renderTripList() {
    render(this._tripDaysListComponent, new TripDaysItem(), RENDER_POSITION.BEFOREEND);
    const container = this._container.querySelector(`.trip-days__item`);
    this._renderTripDaysItem(container, this._getTripsData());
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

  _clearMainTripList({resetSortType = false} = {}) {
    Object
      .values(this._tripPresenterObserver)
      .forEach((tripPresenter) => tripPresenter.destroy());
    this._tripPresenterObserver = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    remove(this._tripDaysListComponent);

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.EVENT;
    }
  }

  _renderMainRender() {
    if (!this._getTripsData().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    render(this._container, this._tripDaysListComponent, RENDER_POSITION.BEFOREEND);
    this._renderTrips();
  }

  _renderInfo() {
    const tripMain = document.querySelector(`.trip-main`);
    const infoContainer = new InfoContainer();
    render(tripMain, infoContainer, RENDER_POSITION.AFTERBEGIN);
    render(infoContainer, new Cost(), RENDER_POSITION.BEFOREEND);
    if (this._getTripsData().length) {
      render(tripMain, new MainInfo(this._getTripsData()), RENDER_POSITION.AFTERBEGIN);
    }
  }
}
