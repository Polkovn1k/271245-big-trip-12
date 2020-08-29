import {RENDER_POSITION} from '../const';
import {render, replace} from '../utils/render';
import TripEventItem from '../components/trip-event-item-component';
import TripEventEditItem from '../components/event-edit-component';

export default class Trip {
  constructor(container) {
    this._container = container;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleEditClick  = this._handleEditClick.bind(this);
    this._handleFormSubmit  = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  };

  _handleEditClick() {
    this._replaceEventToEdit();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit() {
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditToEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
  };

  _replaceEventToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
  };

  init(data) {
    this._data = data;

    this._tripEventComponent = new TripEventItem(data);
    this._tripEventEditComponent = new TripEventEditItem(data);

    this._tripEventComponent.setRollupClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._container, this._tripEventComponent, RENDER_POSITION.BEFOREEND);
  }
}
