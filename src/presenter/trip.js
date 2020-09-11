import {renderPosition, userActionType, dataUpdateType} from "../const";

import TripEventItem from "../components/trip-event-item-component";
import TripEventEditItem from "../components/event-edit-component";

import {render, replace, remove} from "../utils/render";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Trip {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(tripData) {
    this._data = tripData;

    const prevEventComponent = this._tripEventComponent;
    const prevEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventItem(tripData);
    this._tripEventEditComponent = new TripEventEditItem(tripData);

    this._tripEventComponent.setRollupClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setFavoriteChangeHandler(this._handleFavoriteChange);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._container, this._tripEventComponent, renderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  _handleEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToEdit();
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleFormSubmit(data) {
    this._changeData(
        userActionType.UPDATE_TRIP,
        dataUpdateType.MINOR,
        data
    );
    this._replaceEditToEvent();
  }

  _handleFavoriteChange() {
    this._changeData(
        userActionType.UPDATE_TRIP,
        dataUpdateType.PATCH,
        Object
          .assign(
              {},
              this._data,
              {
                isFavorite: !this._data.isFavorite
              }
          )
    );
  }

  _handleDeleteClick(data) {
    this._changeData(
        userActionType.DELETE_TRIP,
        dataUpdateType.MINOR,
        data
    );
    this._replaceEditToEvent();
  }

  _replaceEditToEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
