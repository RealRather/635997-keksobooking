'use strict';

(function () {
  var GUESTS_DEPENDING_ROOMS = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var BUILDING_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var formSelectRoomCount = document.querySelector('#room_number');
  var formSelectRoomCapacity = document.querySelector('#capacity');
  var formSelectType = document.querySelector('#type');
  var formSelectPrice = document.querySelector('#price');

  // Оганичивает число гостей в зависимости от числа комнат
  var limitGueststOptions = function (roomCount, roomCapacity) {
    var limitGuests = GUESTS_DEPENDING_ROOMS[roomCount.value];
    roomCapacity.setCustomValidity('');
    if (limitGuests.indexOf(parseInt(roomCapacity.value, 10)) < 0) {
      roomCapacity.setCustomValidity('Число гостей не подходит для данного количества комнат');
    }
  };

  // Определяет стоимость в сутки в зависимости от типа жилья
  var determinePrice = function (buildingType, buildingPrice) {
    buildingPrice.min = BUILDING_PRICE[buildingType.value];
    buildingPrice.placeholder = buildingPrice.min;
  };

  var onSelectRoomCountChange = function () {
    limitGueststOptions(formSelectRoomCount, formSelectRoomCapacity);
  };

  var onSelectPriceChange = function () {
    determinePrice(formSelectType, formSelectPrice);
  };

  // Добавление обработчика цены в зависимости от типа жилья
  formSelectType.addEventListener('change', onSelectPriceChange);

  // Добавление обработчиков кол-ва мест от кол-ва комнат
  formSelectRoomCount.addEventListener('change', onSelectRoomCountChange);
  formSelectRoomCapacity.addEventListener('change', onSelectRoomCountChange);
})();