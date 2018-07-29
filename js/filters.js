'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var filterHousingType = mapFilters.querySelector('#housing-type');
  var filterHousingPrice = mapFilters.querySelector('#housing-price');
  var filterHousingRooms = mapFilters.querySelector('#housing-rooms');
  var filterHousingGuests = mapFilters.querySelector('#housing-guests');
  var filterHousingFeatures = mapFilters.querySelector('#housing-features');

  var filterType = function (arrayData) {
    return (filterHousingType.value === 'any' || arrayData.offer.type === filterHousingType.value);
  };

  var filterPrice = function (arrayData) {
    switch (filterHousingPrice.value) {
      case 'high':
        return (arrayData.offer.price > 50000);
      case 'middle':
        return (arrayData.offer.price > 10000 && arrayData.offer.price < 50000);
      case 'low':
        return (arrayData.offer.price < 10000);
      default:
        return true;
    }
  };

  var filterRooms = function (arrayData) {
    return ((arrayData.offer.rooms.toString() === filterHousingRooms.value) || (filterHousingRooms.value === 'any'));
  };

  var filterGuests = function (arrayData) {
    return ((filterHousingGuests.value === arrayData.offer.guests.toString()) || (filterHousingGuests.value === 'any'));
  };

  var filterFeatures = function (arrayData) {
    var checked = filterHousingFeatures.querySelectorAll('input[type=checkbox]:checked');
    var selected = [].map.call(checked, function (it) {
      return it.value;
    });
    return selected.every(function (feature) {
      return arrayData.offer.features.includes(feature);
    });
  };

  var onFormFilterChange = function () {
    var filterResultArray = window.arrayData.filter(filterType).filter(filterPrice).filter(filterRooms).filter(filterRooms).filter(filterGuests).filter(filterFeatures);
    window.pins.removeAllPins();
    window.map.closeCard();
    window.pins.renderMapPins(
        window.map.getArrayAdverts(window.map.AMOUNT_ADVERTS, filterResultArray)
    );
  };

  mapFilters.addEventListener('change', onFormFilterChange);
})();
