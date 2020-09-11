import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import "../../node_modules/flatpickr/dist/themes/material_blue.css";

const getFlatpickrStart = function (startDateData, handler, context) {
  const startDateElement = context.getElement().querySelector(`.event__input--time[name="event-start-time"]`);
  return flatpickr(startDateElement, {
    enableTime: true,
    altInput: true,
    allowInput: true,
    dateFormat: `Y/m/d H:i`,
    altFormat: `Y/m/d H:i`,
    defaultDate: startDateData,
    onChange: handler,
  });
};

const getFlatpickrEnd = function (endDateData, handler, context) {
  const endDateElement = context.getElement().querySelector(`.event__input--time[name="event-end-time"]`);
  return flatpickr(endDateElement, {
    enableTime: true,
    altInput: true,
    allowInput: true,
    dateFormat: `Y/m/d H:i`,
    altFormat: `Y/m/d H:i`,
    defaultDate: endDateData,
    onChange: handler,
  });
};

export {getFlatpickrStart, getFlatpickrEnd};
