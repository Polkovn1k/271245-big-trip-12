import {UserActionType, DataUpdateType, RenderPosition, ONE_HOUR} from "../const";

import TripEventEditComponent from "../components/trip-event-edit-item";

import {remove, render} from "../utils/render";

const DEFAULT_PRICE = 1;

const defaultData = {
  type: `taxi`,
  destinationName: ``,
  offers: [],
  destinationInfo: {
    destinationDescription: null,
    destinationPhoto: null,
  },
  price: DEFAULT_PRICE,
  date: {
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + ONE_HOUR),
  },
  isFavorite: null,
  addMode: true,
};

export default class TripNew {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;

    this._tripEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(options) {
    if (this._tripEditComponent !== null) {
      return;
    }

    this._tripEditComponent = new TripEventEditComponent(defaultData, options);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripListContainer, this._tripEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEditComponent === null) {
      return;
    }

    remove(this._tripEditComponent);
    this._tripEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
  }

  setAborting() {
    const resetFormState = () => {
      this._tripEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._tripEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(trip) {
    this._changeData(
        UserActionType.ADD_TRIP,
        DataUpdateType.MINOR,
        Object
          .assign(
              {},
              trip,
              {
                isFavorite: false,
                addMode: false,
              }
          )
    );
  }

  setSaving() {
    this._tripEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
