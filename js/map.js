'use strict';

(function () {
  var MAP_PIN_INITIAL_WIDTH = 50;
  var MAP_PIN_INITIAL_HEIGHT = 70;

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var AUXILIARY_ELEMENTS_COUNT = 2;
  var AMOUNT_ADVERTS = 5;

  var globalMap = document.querySelector('.map');
  var mapContainer = document.querySelector('.map__filters-container');
  var mapMainPin = document.querySelector('.map__pin--main');

  var isActiveMapState = false;

  // Установление главного пина в исходное состояние
  var setDefaultAddressMapPin = function () {
    mapMainPin.style.left = Math.round((globalMap.offsetWidth - mapMainPin.offsetWidth) / 2) + 'px';
    mapMainPin.style.top = Math.round((globalMap.offsetHeight - LOCATION_Y_MIN) / 2) + mapMainPin.offsetHeight + 'px';
  };

  // Определяет адрес метки
  var determineAddressMapPin = function (heightPin, widthPin, pin) {
    var pinLocationY = heightPin + parseInt(pin.style.top, 10);
    var locationX = Math.round((widthPin / 2) + parseInt(pin.style.left, 10));
    var pinLocationX = (parseInt(pin.style.left, 10) < 0) ? 0 : locationX;
    if (pinLocationX > globalMap.offsetWidth) {
      pinLocationX = globalMap.offsetWidth;
    }
    return pinLocationX + ', ' + pinLocationY;
  };

  // Присваивает адрес главной метке
  var assignAddressMapPin = function (isMapPin) {
    var widthMapPin = isMapPin ? MAP_PIN_INITIAL_WIDTH : window.pins.MAP_PIN_WIDTH;
    var heightMapPin = isMapPin ? MAP_PIN_INITIAL_HEIGHT : window.pins.MAP_PIN_HEIGHT;
    window.form.formInputAddress.value = determineAddressMapPin(heightMapPin, widthMapPin, mapMainPin);
  };

  var closeCard = function () {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
  };

  // Присваивает адрес главной метке(карта не активна)
  setDefaultAddressMapPin();
  assignAddressMapPin(true);

  var getArrayAdverts = function (countObject, array) {
    var arrayAdverts = array ? array.slice() : [];
    arrayAdverts.splice(countObject);
    return arrayAdverts;
  };

  // Добавляет данные
  if (!window.arrayData) {
    window.backend.requestServerData(function (data) {
      window.arrayData = data.slice();
      getArrayAdverts(AMOUNT_ADVERTS, window.arrayData);
    },
    window.form.displayError
    );
  } else {
    getArrayAdverts(AMOUNT_ADVERTS, window.arrayData);
  }

  var blockMapState = function () {
    isActiveMapState = false;

    window.form.switchStateFieldset(true);
    window.pins.removeAllPins();
    closeCard();
    // Переключает карту в неактивное состояние
    globalMap.classList.add('map--faded');
    // Блокирует поля формы
    window.form.formAd.classList.add('ad-form--disabled');
    // Присваивает адрес главной метке(карта не активна)
    setDefaultAddressMapPin();
    assignAddressMapPin(true);

    mapMainPin.addEventListener('mouseup', onButtonMainPinMouseUp);
  };

  var activateMapState = function () {
    isActiveMapState = true;
    window.form.switchStateFieldset(false);
    // Переключает карту в активное состояние
    globalMap.classList.remove('map--faded');
    // Разблокирует поля формы
    window.form.formAd.classList.remove('ad-form--disabled');
    // Присваивает адрес главной метке(карта активна)
    assignAddressMapPin(false);

    //  обработчик на кнопке "Очистить"
    window.form.formButtonReset.addEventListener('click', window.form.onButtonResetFormClick);
  };

  var onButtonMainPinMouseUp = function () {
    if (!isActiveMapState) {
      activateMapState();
      window.pins.renderMapPins(
          getArrayAdverts(AMOUNT_ADVERTS, window.arrayData)
      );
    }
    mapMainPin.removeEventListener('mouseup', onButtonMainPinMouseUp);
  };

  // Получает индекс узла
  var getIndexNode = function (documentNode) {
    var nodes = Array.prototype.slice.call(documentNode.parentNode.children);
    return nodes.indexOf(documentNode);
  };
  var onButtonRandomPinClick = function (evt) {
    var documentNode = evt.target.closest('button');
    if (!documentNode || documentNode.classList.contains('map__pin--main')) {
      return;
    }
    var randomCard = window.createCard.getGeneratedCard(
        getArrayAdverts(AMOUNT_ADVERTS, window.arrayData)[getIndexNode(documentNode) - AUXILIARY_ELEMENTS_COUNT]
    );
    globalMap.insertBefore(randomCard, mapContainer);
  };

  // Добавление обработчика для меток и карты
  window.pins.mapPinsElement.addEventListener('click', onButtonRandomPinClick);
  mapMainPin.addEventListener('mouseup', onButtonMainPinMouseUp);

  // Перемещение главного маркера по карте
  mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    assignAddressMapPin(false);

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newMainPinCoords = {
        y: mapMainPin.offsetTop - shift.y,
        x: mapMainPin.offsetLeft - shift.x
      };
      if ((LOCATION_Y_MIN - mapMainPin.offsetHeight <= newMainPinCoords.y) &&
        (newMainPinCoords.y <= LOCATION_Y_MAX - mapMainPin.offsetHeight)) {
        mapMainPin.style.top = newMainPinCoords.y + 'px';
      }
      if ((globalMap.style.left - (mapMainPin.offsetWidth / 2) <= newMainPinCoords.x) &&
        (newMainPinCoords.x <= (
          globalMap.offsetWidth - mapMainPin.offsetWidth / 2)
        )
      ) {
        if (newMainPinCoords.x < 0 - Math.round(mapMainPin.offsetWidth / 2)) {
          mapMainPin.style.left = 0 + 'px';
        } else {
          mapMainPin.style.left = newMainPinCoords.x + 'px';
        }
      }
      assignAddressMapPin(false);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function () {
          evt.preventDefault();
          mapMainPin.removeEventListener('click', onClickPreventDefault);
        };
        mapMainPin.addEventListener('click', onClickPreventDefault);
      }

    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    assignAddressMapPin(false);
  });

  window.map = {
    globalMap: globalMap,
    mapContainer: mapContainer,
    LOCATION_Y_MIN: LOCATION_Y_MIN,
    LOCATION_Y_MAX: LOCATION_Y_MAX,
    AMOUNT_ADVERTS: AMOUNT_ADVERTS,
    blockMapState: blockMapState,
    getArrayAdverts: getArrayAdverts,
    assignAddressMapPin: assignAddressMapPin,
    closeCard: closeCard
  };
})();
