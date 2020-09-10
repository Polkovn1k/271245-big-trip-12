import {renderPosition, itemSortType, dataUpdateType, userActionType, filterChangeType} from "../const";

import Sort from "../components/sort-component";
import TripPresenter from "./trip";
import NewTripPresenter from "./new-trip";
import TripDaysList from "../components/trip-days-list-component";
import TripDaysItem from "../components/trip-days-item-component";
import TripEventList from "../components/trip-events-list-component";
import NoPoints from "../components/no-points-component";
import InfoContainer from "../components/info-container-component";
import Cost from "../components/cost-component";
import MainInfo from "../components/main-info-component";

import {generateTripDays, getTripDaysString} from "../mock-data/trip-event-date-data";
import {render, remove} from "../utils/render";
import {filter} from "../utils/filter";

export default class Trip {
  constructor(container, tripModel, filterModel) {
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._container = container;
    this._currentSortType = itemSortType.EVENT;
    this._tripPresenterObserver = {};

    this._sortComponent = null;
    this._tripDaysListComponent = new TripDaysList();
    this._noPointsComponent = new NoPoints();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._tripModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newTripPresenter = new NewTripPresenter(this._tripDaysListComponent, this._handleViewAction);
  }

  init() {
    this._renderMainRender();
    this._renderInfo();
  }

  createTrip() {
    this._currentSortType = itemSortType.EVENT;
    this._filterModel.setFilter(dataUpdateType.MAJOR, filterChangeType.EVERYTHING);
    this._newTripPresenter.init();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case userActionType.UPDATE_TRIP:
        this._tripModel.updateTrip(updateType, update);
        break;
      case userActionType.ADD_TRIP:
        this._tripModel.addTrip(updateType, update);
        break;
      case userActionType.DELETE_TRIP:
        this._tripModel.deleteTrip(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case dataUpdateType.PATCH:
        this._tripPresenterObserver[data.id].init(data);
        break;
      case dataUpdateType.MINOR:
        this._clearMainTripList();
        this._renderMainRender();
        break;
      case dataUpdateType.MAJOR:
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
  }

  _getTripsData() {
    const filterType = this._filterModel.getFilter();
    const tripData = this._tripModel.getTrips();
    const filtredTripData = filter[filterType](tripData);

    switch (this._currentSortType) {
      case itemSortType.TIME:
        return filtredTripData.sort((a, b) => (new Date(b.date.endDate) - new Date(b.date.startDate)) - (new Date(a.date.endDate) - new Date(a.date.startDate)));
      case itemSortType.PRICE:
        return filtredTripData.sort((a, b) => b.price - a.price);
    }
    return filtredTripData;
  }

  _handleModeChange() {
    this._newTripPresenter.destroy();
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
    render(this._container, this._sortComponent, renderPosition.BEFOREEND);
  }

  _renderTripEventItem(eventsContainer, currentDayEvent) {
    const tripPresenter = new TripPresenter(eventsContainer, this._handleViewAction, this._handleModeChange);
    tripPresenter.init(currentDayEvent);
    this._tripPresenterObserver[currentDayEvent.id] = tripPresenter;
  }

  _renderTrips() {
    if (this._currentSortType === itemSortType.EVENT) {
      this._renderTripDaysList();
    } else {
      this._renderTripList();
    }
  }

  _renderTripDaysList() {
    const tripDays = generateTripDays(this._getTripsData());
    tripDays.forEach((item, i) => {
      render(this._tripDaysListComponent, new TripDaysItem(item, i + 1), renderPosition.BEFOREEND);
    });

    const tripDaysItem = this._container.querySelectorAll(`.trip-days__item`);
    tripDaysItem.forEach((tripDayItem, i) => {
      this._renderTripDaysItem(tripDayItem, this._getTripsData(), tripDays[i]);
    });
  }

  _renderTripList() {
    render(this._tripDaysListComponent, new TripDaysItem(), renderPosition.BEFOREEND);
    const container = this._container.querySelector(`.trip-days__item`);
    this._renderTripDaysItem(container, this._getTripsData());
  }

  _renderTripDaysItem(container, data, tripDay) {
    const eventList = new TripEventList();
    render(container, eventList, renderPosition.BEFOREEND);
    const dataList = tripDay ?
      data.slice().filter((eventItem) => getTripDaysString(eventItem) === tripDay) :
      data.slice();

    dataList.forEach((currentDayEvent) => {
      this._renderTripEventItem(eventList, currentDayEvent);
    });
  }

  _renderNoPoints() {
    render(this._container, this._noPointsComponent, renderPosition.BEFOREEND);
  }

  _clearMainTripList({resetSortType = false} = {}) {
    this._newTripPresenter.destroy();
    Object
      .values(this._tripPresenterObserver)
      .forEach((tripPresenter) => tripPresenter.destroy());
    this._tripPresenterObserver = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    remove(this._tripDaysListComponent);

    if (resetSortType) {
      this._currentSortType = itemSortType.EVENT;
    }
  }

  _renderMainRender() {
    if (!this._getTripsData().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    render(this._container, this._tripDaysListComponent, renderPosition.BEFOREEND);
    this._renderTrips();
  }

  _renderInfo() {
    const tripMain = document.querySelector(`.trip-main`);
    const infoContainer = new InfoContainer();
    render(tripMain, infoContainer, renderPosition.AFTERBEGIN);
    render(infoContainer, new Cost(), renderPosition.BEFOREEND);
    if (this._getTripsData().length) {
      render(tripMain, new MainInfo(this._getTripsData()), renderPosition.AFTERBEGIN);
    }
  }
}
