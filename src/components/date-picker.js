import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import "../../node_modules/flatpickr/dist/themes/material_blue.css";

const datePicker = function() {
  if (this._flatpickrStart && this._flatpickrEnd) {
    this._flatpickrStart.destroy();
    this._flatpickrStart = null;
    this._flatpickrEnd.destroy();
    this._flatpickrEnd = null;
  }

  const startDateElement = this.getElement().querySelector(`.event__input--time[name="event-start-time"]`);
  this._flatpickrStart = flatpickr(startDateElement, {
    enableTime: true,
    altInput: true,
    allowInput: true,
    dateFormat: `Y/m/d H:i`,
    altFormat: `Y/m/d H:i`,
    defaultDate: this._data.date.startDate,
    onChange: this._startDateChangeHandler,
  });

  const endDateElement = this.getElement().querySelector(`.event__input--time[name="event-end-time"]`);
  this._flatpickrStart = flatpickr(endDateElement, {
    enableTime: true,
    altInput: true,
    allowInput: true,
    dateFormat: `Y/m/d H:i`,
    altFormat: `Y/m/d H:i`,
    defaultDate: this._data.date.endDate,
    onChange: this._endDateChangeHandler,
  });
};

export {datePicker}
