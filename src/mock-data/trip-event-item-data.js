import {getRandomItemFromArray, getRandomNumberFromInterval} from '../utils/common';
import {TRANSFER_TYPE, ACTIVITY_TYPE, EVENT_DESTINATION, RANDOM_PRICE_SETTINGS} from '../const';
import {generateTripEventOfferData} from './trip-event-offer-data';
import {generateTripEventDateData} from "./trip-event-date-data";
import {generateTripEventDestinationData} from "./trip-event-destination-data";

const allEventsType = [...TRANSFER_TYPE, ...ACTIVITY_TYPE];

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateTripEventItemData = () => {
  const type = getRandomItemFromArray(allEventsType);
  const destinationName = getRandomItemFromArray(EVENT_DESTINATION);
  const offers = generateTripEventOfferData()[type];
  const destinationInfo = generateTripEventDestinationData();
  const price = getRandomNumberFromInterval(RANDOM_PRICE_SETTINGS.MIN_PRICE, RANDOM_PRICE_SETTINGS.MAX_PRICE, RANDOM_PRICE_SETTINGS.MULTIPLE);
  const date = generateTripEventDateData();
  const isFavorite = Math.random() > 0.5 ? true : false;

  return {
    id: generateId(),
    type,
    destinationName,
    offers,
    destinationInfo,
    price,
    date,
    isFavorite,
  };
};

const generateTripEventsData = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => generateTripEventItemData());
};

export {generateTripEventsData};

