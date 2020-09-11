import moment from "moment";

const castTimeFormat = (value) => value < 10 ? `0${value}` : String(value);

const formatTime = (date) => moment(date).format(`hh:mm`);

const formatDate = (date) => moment(date).format(`DD MMMM`);

const timeDuration = (start, end) => {
  const momentDiff = moment(end).diff(moment(start));
  const momentDuration = moment.duration(momentDiff);

  const duration = {
    days: momentDuration.get(`days`) > 0 ? `${castTimeFormat(momentDuration.get(`days`))}D` : ``,
    hours: momentDuration.get(`hours`) > 0 ? `${castTimeFormat(momentDuration.get(`hours`))}H` : ``,
    minutes: momentDuration.get(`minutes`) > 0 ? `${castTimeFormat(momentDuration.get(`minutes`))}M` : ``,
  };

  return `${duration.days} ${duration.hours} ${duration.minutes}`;
};

export {
  castTimeFormat,
  formatTime,
  formatDate,
  timeDuration,
};
