'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var filterHousingType = mapFilters.querySelector('#housing-type');
  /* var filterHousingPrice = mapFilters.querySelector('#housing-price');
  var filterHousingRooms = mapFilters.querySelector('#housing-rooms');
  var filterHousingGuests = mapFilters.querySelector('#housing-guests');
  var filterHousingFeatures = mapFilters.querySelector('#housing__features');*/

  var filterType = function (data) {
    return filterHousingType.value === 'any' || data.offer.type === filterHousingType;
  };

  var onFormFilterChange = function () {
    var filterResultArray = window.map.globalMap.filter(filterType);
    window.pins.renderMapPins(
        window.map.getArrayAdverts(
            window.map.AMOUNT_ADVERTS, filterResultArray
        )
    );
  };

  mapFilters.addEventListener('change', onFormFilterChange);
})();
