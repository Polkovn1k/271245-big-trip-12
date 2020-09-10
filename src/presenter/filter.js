import {filterChangeType, dataUpdateType, renderPosition} from "../const";

import FilterView from "../components/filter-component";

import {render, replace, remove} from "../utils/render";
import {filter} from "../utils/filter";


export default class Filter {
  constructor(filterContainer, filterModel, tripModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._tripModel = tripModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._tripModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, renderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(dataUpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const tripData = this._tripModel.getTrips();

    return [
      {
        type: filterChangeType.EVERYTHING,
        name: filterChangeType.EVERYTHING,
        count: filter[filterChangeType.EVERYTHING](tripData).length
      },
      {
        type: filterChangeType.FUTURE,
        name: filterChangeType.FUTURE,
        count: filter[filterChangeType.FUTURE](tripData).length
      },
      {
        type: filterChangeType.PAST,
        name: filterChangeType.PAST,
        count: filter[filterChangeType.PAST](tripData).length
      },
    ];
  }
}
