import {TRANSFER_TYPE, ACTIVITY_TYPE, EVENT_DESTINATION, RandomPriceSettings} from '../const';

import {generateId} from "../utils/common";

import {getRandomItemFromArray, getRandomNumberFromInterval} from '../utils/common';
import {generateTripEventOfferData} from './trip-event-offer-data';
import {generateTripEventDateData} from "./trip-event-date-data";
import {generateTripEventDestinationData} from "./trip-event-destination-data";

const allEventsType = [...TRANSFER_TYPE, ...ACTIVITY_TYPE];

const generateTripEventItemData = () => {
  const type = getRandomItemFromArray(allEventsType);
  const destinationName = getRandomItemFromArray(EVENT_DESTINATION);
  const offers = generateTripEventOfferData()[type];
  const destinationInfo = generateTripEventDestinationData();
  const price = getRandomNumberFromInterval(RandomPriceSettings.MIN_PRICE, RandomPriceSettings.MAX_PRICE, RandomPriceSettings.MULTIPLE);
  const date = generateTripEventDateData();
  const isFavorite = Math.random() > 0.5;

  return {
    id: generateId(),
    type,
    destinationName,
    offers,
    destinationInfo,
    price,
    date,
    isFavorite,
    addMode: false,
  };
};

const generateTripEventsData = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => generateTripEventItemData());
};

export {generateTripEventsData};

