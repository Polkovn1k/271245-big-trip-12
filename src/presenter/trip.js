import {RENDER_POSITION} from '../const';
import {render, replace, remove} from '../utils/render';
import TripEventItem from '../components/trip-event-item-component';
import TripEventEditItem from '../components/event-edit-component';

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

    this._handleEditClick  = this._handleEditClick.bind(this);
    this._handleFormSubmit  = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
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

  _handleFormSubmit(data) {
    this._changeData(data);
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFavoriteChange() {
    this._changeData(
      Object.assign(
        {},
        this._data,
        {
          isFavorite: !this._data.isFavorite
        }
      )
    );
  }

  _replaceEditToEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    this._mode = Mode.DEFAULT;
  };

  _replaceEventToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  };

  init(data) {
    this._data = data;

    const prevEventComponent = this._tripEventComponent;
    const prevEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventItem(data);
    this._tripEventEditComponent = new TripEventEditItem(data);

    this._tripEventComponent.setRollupClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setFavoriteChangeHandler(this._handleFavoriteChange);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._container, this._tripEventComponent, RENDER_POSITION.BEFOREEND);
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
