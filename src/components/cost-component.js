import AbstractView from "./abstract";

const totalPriceCalc = (arr) => {
  return arr.reduce(function(sum, current) {
    return sum + current.price;
  }, 0);
};

const createCostTemplate = (totalPrice) => {
  const price = totalPrice ? totalPriceCalc(totalPrice) : 0;

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`
  );
};

export default class Cost extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createCostTemplate(this._data);
  }
}
