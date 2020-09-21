import {RenderPosition, UserActionType, DataUpdateType} from "../const";

import TripEventItem from "../components/trip-event-item-component";
import TripEventEditItem from "../components/event-edit-component";

import {render, replace, remove} from "../utils/render";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
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

  init(tripData, options) {
    this._data = tripData;
    this._optionsModel = options;

    const prevEventComponent = this._tripEventComponent;
    const prevEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventItem(tripData);
    this._tripEventEditComponent = new TripEventEditItem(tripData, options);

    this._tripEventComponent.setRollupClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setFavoriteChangeHandler(this._handleFavoriteChange);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
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
        UserActionType.UPDATE_TRIP,
        DataUpdateType.MINOR,
        data
    );
  }

  _handleFavoriteChange() {
    this._changeData(
        UserActionType.UPDATE_TRIP,
        DataUpdateType.PATCH,
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
        UserActionType.DELETE_TRIP,
        DataUpdateType.MINOR,
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

  setViewState(state) {
    const resetFormState = () => {
      this._tripEventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripEventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._tripEventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._tripEventComponent.shake(resetFormState);
        this._tripEventEditComponent.shake(resetFormState);
        break;
    }
  }
}
