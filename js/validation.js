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

  var formSelectRoomCount = window.form.formAd.querySelector('#room_number');
  var formSelectRoomCapacity = window.form.formAd.querySelector('#capacity');
  var formSelectType = window.form.formAd.querySelector('#type');
  var formSelectPrice = window.form.formAd.querySelector('#price');
  var formSuccess = document.querySelector('.success');

  // Оганичивает число гостей в зависимости от числа комнат
  var limitGueststOptions = function (roomCount, roomCapacity) {
    var limitGuests = GUESTS_DEPENDING_ROOMS[roomCount.value];
    roomCapacity.setCustomValidity('');
    roomCount.setCustomValidity('');
    if (limitGuests.indexOf(parseInt(roomCapacity.value, 10)) < 0) {
      if (roomCount.value !== '100' && roomCapacity.value === '0') {
        roomCapacity.setCustomValidity('Вариант "не для гостей" предусмотрен только для 100 комнат');
      } else if (roomCount.value === '100' && roomCapacity.value !== '0') {
        roomCapacity.setCustomValidity('Данное количество комнат не для гостей');
      } else if (roomCount.value >= roomCapacity.value) {
        roomCapacity.setCustomValidity('');
      } else {
        roomCapacity.setCustomValidity('Для каждого гостя предусмотрена максимум одна комната');
      }
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

  var onSuccessPopupEscPress = function () {
    formSuccess.classList.add('hidden');
  };

  // Добавление обработчика цены в зависимости от типа жилья
  formSelectType.addEventListener('change', onSelectPriceChange);

  // Добавление обработчиков кол-ва мест от кол-ва комнат
  formSelectRoomCount.addEventListener('change', onSelectRoomCountChange);
  formSelectRoomCapacity.addEventListener('change', onSelectRoomCountChange);

  window.form.formAd.addEventListener('submit', function (evt) {
    window.backend.requestServerData(
        function () {
          formSuccess.classList.remove('hidden');
          window.map.blockMapState();
          window.form.formAd.reset();
          document.addEventListener('keydown', function (evtK) {
            window.util.isEscKeyCode(evtK, onSuccessPopupEscPress);
            window.map.assignAddressMapPin(true);
          });
          formSuccess.addEventListener('click', function () {
            formSuccess.classList.add('hidden');
            window.map.assignAddressMapPin(true);
          });
        },
        window.form.displayError,
        new FormData(window.form.formAd)
    );
    evt.preventDefault();
  });
})();

