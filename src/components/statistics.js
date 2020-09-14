import {destinationTypeIcons, ACTIVITY_TYPE} from '../const';

import AbstractView from "./abstract";

import {calcPrice, calcTimeSpent} from "../utils/stat";

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const setTotalMoneyChart = (eventDataList, moneyCtx) => {
  const eventTypesList = [...new Set(eventDataList.map((item) => item.type))];
  const eventsTotalPriceList = eventTypesList.map((type) => calcPrice(eventDataList, type));
  const uniqueTypeListWithIcons = eventTypesList.map((item) => `${destinationTypeIcons[item]} ${item.toUpperCase()}`);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypeListWithIcons,
      datasets: [{
        data: eventsTotalPriceList,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const setTransportChart = (eventDataList, transportCtx) => {
  const transportType = eventDataList.filter((item) => !ACTIVITY_TYPE.includes(item.type)).map((item) => item.type);
  const uniqueTransportType = [...new Set(transportType)];
  const transportTypeCount = uniqueTransportType.map((type) => eventDataList.filter((dataItem) => dataItem.type === type).length);
  const uniqueTransportTypeWithIcons = uniqueTransportType.map((item) => `${destinationTypeIcons[item]} ${item.toUpperCase()}`);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTransportTypeWithIcons,
      datasets: [{
        data: transportTypeCount,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const setTimeChart = (eventDataList, timeSpendCtx) => {
  const eventTypesList = [...new Set(eventDataList.map((item) => item.type))];
  const eventsTotalTimeList = eventTypesList.map((type) => calcTimeSpent(eventDataList, type));
  const uniqueTypeListWithIcons = eventTypesList.map((item) => `${destinationTypeIcons[item]} ${item.toUpperCase()}`);

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueTypeListWithIcons,
      datasets: [{
        data: eventsTotalTimeList,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

export default class Statistics extends AbstractView {
  constructor(tripData) {
    super();
    this._data = tripData;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = setTotalMoneyChart(this._data, moneyCtx);
    this._transportChart = setTransportChart(this._data, transportCtx);
    this._timeSpentChart = setTimeChart(this._data, timeSpendCtx);
  }
}
