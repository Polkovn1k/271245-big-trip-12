import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import "../../node_modules/flatpickr/dist/themes/material_blue.css";

const getFlatpickrStart = function(startDateData, handler) {
  const startDateElement = this.getElement().querySelector(`.event__input--time[name="event-start-time"]`);
  return flatpickr(startDateElement, {
    enableTime: true,
    altInput: true,
    allowInput: true,
    dateFormat: `Y/m/d H:i`,
    altFormat: `Y/m/d H:i`,
    defaultDate: this._data.date.startDate,
    onChange: this._startDateChangeHandler,
  });
};

const getFlatpickrEnd = function(endDateData, handler) {
  const endDateElement = this.getElement().querySelector(`.event__input--time[name="event-end-time"]`);
  return flatpickr(endDateElement, {
    enableTime: true,
    altInput: true,
    allowInput: true,
    dateFormat: `Y/m/d H:i`,
    altFormat: `Y/m/d H:i`,
    defaultDate: this._data.date.endDate,
    onChange: this._endDateChangeHandler,
  });
};

export {getFlatpickrStart, getFlatpickrEnd};
