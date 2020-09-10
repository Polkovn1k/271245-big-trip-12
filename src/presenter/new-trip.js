import TripEventEditComponent from "../components/event-edit-component";
import {remove, render} from "../utils/render";
import {generateId} from "../utils/common";
import {USERACTION, UPDATETYPE, RENDER_POSITION} from "../const";

const defaultData = {
  type: ``,
  destinationName: ``,
  offers: [],
  destinationInfo: {
    destinationDescription: null,
    destinationPhoto: null,
  },
  price: 1,
  date: {
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 3600000),
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

  init() {
    if (this._tripEditComponent !== null) {
      return;
    }

    this._tripEditComponent = new TripEventEditComponent(defaultData);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripListContainer, this._tripEditComponent, RENDER_POSITION.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEditComponent === null) {
      return;
    }

    remove(this._tripEditComponent);
    this._tripEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(trip) {
    this._changeData(
      USERACTION.ADD_TRIP,
      UPDATETYPE.MINOR,
      Object.assign(
        {},
        trip,
        {
          isFavorite: false,
          addMode: false,
          id: generateId(),
        }
      )
    );
    this.destroy();
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
