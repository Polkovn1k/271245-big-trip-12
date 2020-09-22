import {RenderPosition, ItemSortType, DataUpdateType, UserActionType, State as TripPresenterViewState} from "../const";

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
import Loading from "../components/loading";

import {generateTripDays, getTripDaysString} from "../utils/common";
import {render, remove} from "../utils/render";
import {filter} from "../utils/filter";

export default class Trip {
  constructor(container, tripModel, filterModel, optionsModel, api) {
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._optionsModel = optionsModel;
    this._container = container;
    this._currentSortType = ItemSortType.EVENT;
    this._tripPresenterObserver = {};
    this._isLoading = true;

    this._api = api;

    this._sortComponent = null;
    this._tripDaysListComponent = new TripDaysList();
    this._noPointsComponent = new NoPoints();
    this._loadingComponent = new Loading();
    this._infoContainerComponent = null;
    this._costComponent = null;
    this._mainInfoComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._tripModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._optionsModel.addObserver(this._handleModelEvent);

    this._newTripPresenter = new NewTripPresenter(this._tripDaysListComponent, this._handleViewAction);
  }

  init() {
    this._renderMainRender();

    this._tripModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._optionsModel.addObserver(this._handleModelEvent);
  }

  destroy({onlyMainList = false} = {}) {
    this._clearMainTripList({resetSortType: true});
    if (!onlyMainList) {
      this._clearHeader();
    }

    this._tripModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._optionsModel.removeObserver(this._handleModelEvent);
  }

  createTrip() {
    this._newTripPresenter.init(this._optionsModel);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserActionType.UPDATE_TRIP:
        this._tripPresenterObserver[update.id].setViewState(TripPresenterViewState.SAVING);
        this._api.updateTrip(update)
          .then((response) => {
            this._tripModel.updateTrip(updateType, response);
          })
          .catch(() => {
            this._tripPresenterObserver[update.id].setViewState(TripPresenterViewState.ABORTING);
          });
        break;
      case UserActionType.ADD_TRIP:
        this._newTripPresenter.setSaving();
        this._api.addTrip(update)
          .then((response) => {
            this._tripModel.addTrip(updateType, response);
          })
          .catch(() => {
            this._newTripPresenter.setAborting();
          });
        break;
      case UserActionType.DELETE_TRIP:
        this._tripPresenterObserver[update.id].setViewState(TripPresenterViewState.DELETING);
        this._api.deleteTrip(update)
          .then(() => {
            this._tripModel.deleteTrip(updateType, update);
          })
          .catch(() => {
            this._tripPresenterObserver[update.id].setViewState(TripPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case DataUpdateType.PATCH:
        this._tripPresenterObserver[data.id].init(data);
        break;
      case DataUpdateType.MINOR:
        this._clearMainTripList();
        this._clearHeader();
        this._renderMainRender();
        break;
      case DataUpdateType.MAJOR:
        this._clearMainTripList({resetSortType: true});
        this._clearHeader();
        this._renderMainRender();
        break;
      case DataUpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._clearMainTripList({resetSortType: true});
        this._clearHeader();
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
    this._clearHeader();
    this._renderMainRender();
  }

  _getTripsData() {
    const filterType = this._filterModel.getFilter();
    const tripData = this._tripModel.getTrips();
    const filtredTripData = filter[filterType](tripData);

    switch (this._currentSortType) {
      case ItemSortType.TIME:
        return filtredTripData.sort((a, b) => (new Date(b.date.endDate) - new Date(b.date.startDate)) - (new Date(a.date.endDate) - new Date(a.date.startDate)));
      case ItemSortType.PRICE:
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
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTripEventItem(eventsContainer, currentDayEvent) {
    const tripPresenter = new TripPresenter(eventsContainer, this._handleViewAction, this._handleModeChange);
    tripPresenter.init(currentDayEvent, this._optionsModel);
    this._tripPresenterObserver[currentDayEvent.id] = tripPresenter;
  }

  _renderTrips() {
    if (this._currentSortType === ItemSortType.EVENT) {
      this._renderTripDaysList();
    } else {
      this._renderTripList();
    }
  }

  _renderTripDaysList() {
    const tripDays = generateTripDays(this._getTripsData());
    tripDays.forEach((item, i) => {
      render(this._tripDaysListComponent, new TripDaysItem(item, i + 1), RenderPosition.BEFOREEND);
    });

    const tripDaysItem = this._container.querySelectorAll(`.trip-days__item`);
    tripDaysItem.forEach((tripDayItem, i) => {
      this._renderTripDaysItem(tripDayItem, this._getTripsData(), tripDays[i]);
    });
  }

  _renderTripList() {
    render(this._tripDaysListComponent, new TripDaysItem(), RenderPosition.BEFOREEND);
    const container = this._container.querySelector(`.trip-days__item`);
    this._renderTripDaysItem(container, this._getTripsData());
  }

  _renderTripDaysItem(container, data, tripDay) {
    const eventList = new TripEventList();
    render(container, eventList, RenderPosition.BEFOREEND);
    const dataList = tripDay ?
      data.slice().filter((eventItem) => getTripDaysString(eventItem) === tripDay) :
      data.slice();

    dataList.forEach((currentDayEvent) => {
      this._renderTripEventItem(eventList, currentDayEvent);
    });
  }

  _renderNoPoints() {
    render(this._container, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._container, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _clearMainTripList({resetSortType = false} = {}) {
    this._newTripPresenter.destroy();
    Object
      .values(this._tripPresenterObserver)
      .forEach((tripPresenter) => tripPresenter.destroy());
    this._tripPresenterObserver = {};

    remove(this._noPointsComponent);
    remove(this._tripDaysListComponent);
    remove(this._loadingComponent);
    remove(this._sortComponent);

    if (resetSortType) {
      this._currentSortType = ItemSortType.EVENT;
    }
  }

  _clearHeader() {
    remove(this._infoContainerComponent);
    remove(this._costComponent);
    remove(this._mainInfoComponent);
  }

  _renderMainRender() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getTripsData().length) {
      render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);
      this._renderNoPoints();
      return;
    }

    this._renderInfoContainer();
    this._renderSort();
    render(this._container, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    this._renderTrips();
  }

  _renderInfoContainer() {
    if (this._infoContainerComponent !== null) {
      this._infoContainerComponent = null;
      this._costComponent = null;
      this._mainInfoComponent = null;
    }

    this._infoContainerComponent = new InfoContainer();
    render(document.querySelector(`.trip-main`), this._infoContainerComponent, RenderPosition.AFTERBEGIN);

    this._costComponent = new Cost(this._getTripsData());
    this._mainInfoComponent = new MainInfo(this._getTripsData());

    render(this._infoContainerComponent, this._costComponent, RenderPosition.BEFOREEND);
    render(this._infoContainerComponent, this._mainInfoComponent, RenderPosition.AFTERBEGIN);
  }
}
