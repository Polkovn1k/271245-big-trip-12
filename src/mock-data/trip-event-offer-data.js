import {getRandomItemFromArray, getRandomInt, getRandomNumberFromInterval} from "../utils/common";

const MAX_TITLE_ITEMS = 5;

const EVENT_OFFER_TITLE = [
  `Choose the radio station`,
  `Choose temperature`,
  `Drive slowly`,
  `Drive quickly, I'm in a hurry`,
  `Upgrade to a business class`,
  `Choose business class`,
  `Choose comfort class`,
  `Wake up at a certain time`,
  `Order a breakfast`,
  `Book a taxi at the arrival point`,
  `Choose live music`,
  `Choose VIP area`,
  `Business lounge`,
  `Choose seats`,
  `Add luggage`,
];

const tripEventOfferData = {
  'taxi': null,
  'bus': null,
  'train': null,
  'ship': null,
  'transport': null,
  'drive': null,
  'flight': null,
  'check-in': null,
  'sightseeing': null,
  'restaurant': null,
};

const RandomPriceSettings = {
  MIN_PRICE: 100,
  MAX_PRICE: 10000,
  MULTIPLE: 10,
};

const getOffersArray = (arrayLength) => {
  return new Array(arrayLength)
    .fill(``)
    .map(() => ({
      title: getRandomItemFromArray(EVENT_OFFER_TITLE),
      price: getRandomNumberFromInterval(RandomPriceSettings.MIN_PRICE, RandomPriceSettings.MAX_PRICE, RandomPriceSettings.MULTIPLE),
      checked: Math.random() > 0.5,
    }));
};

function generateTripEventOfferData() {
  for (const item in tripEventOfferData) {
    if (tripEventOfferData.hasOwnProperty(item)) {
      const arrayLength = getRandomInt(MAX_TITLE_ITEMS);
      tripEventOfferData[item] = getOffersArray(arrayLength);
    }
  }

  return tripEventOfferData;
}

export {generateTripEventOfferData};
