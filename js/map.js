'use strict';

(function () {
  var MAP_PIN_WIDTH = 65;
  var MAP_PIN_HEIGHT = 65;

  var MAP_PIN_INITIAL_WIDTH = 50;
  var MAP_PIN_INITIAL_HEIGHT = 70;

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var AUXILIARY_ELEMENTS_COUNT = 2;

  var globalMap = document.querySelector('.map');
  var mapPinsElement = globalMap.querySelector('.map__pins');
  var mapContainer = document.querySelector('.map__filters-container');
  var mapMainPin = document.querySelector('.map__pin--main');
  var templateMapPin = document.querySelector('template').content.querySelector('.map__pin');

  var isActiveMapState = false;

  // Создание метки в объявлении
  var getGeneratedPinAdvert = function (mapPin) {
    var pinAdvert = templateMapPin.cloneNode(true);
    pinAdvert.style.top = mapPin.location.y - MAP_PIN_HEIGHT + 'px';
    pinAdvert.style.left = mapPin.location.x - MAP_PIN_WIDTH / 2 + 'px';
    pinAdvert.querySelector('img').alt = mapPin.offer.title;
    pinAdvert.querySelector('img').src = mapPin.author.avatar;
    return pinAdvert;
  };

  // Добавляет метки на страницу
  var createPins = function (arrayAdverts) {
    var pinFragment = document.createDocumentFragment();
    for (var i = 0; i < arrayAdverts.length; i++) {
      pinFragment.appendChild(getGeneratedPinAdvert(arrayAdverts[i]));
    }
    return pinFragment;
  };

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
    var widthMapPin = isMapPin ? MAP_PIN_INITIAL_WIDTH : MAP_PIN_WIDTH;
    var heightMapPin = isMapPin ? MAP_PIN_INITIAL_HEIGHT : MAP_PIN_HEIGHT;
    window.form.formInputAddress.value = determineAddressMapPin(heightMapPin, widthMapPin, mapMainPin);
  };

  // Присваивает адрес главной метке(карта не активна)
  setDefaultAddressMapPin();
  assignAddressMapPin(true);

  var blockMapState = function () {
    isActiveMapState = false;
    window.form.switchStateFieldset(true);
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
  };

  var onButtonMainPinMouseUp = function () {
    if (!isActiveMapState) {
      activateMapState();
    }
    mapPinsElement.appendChild(createPins(window.generateAdverts.adverts));
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
        window.generateAdverts.adverts[getIndexNode(documentNode) - AUXILIARY_ELEMENTS_COUNT]
    );
    globalMap.insertBefore(randomCard, mapContainer);
  };

  // Добавление обработчика для меток и карты
  mapPinsElement.addEventListener('click', onButtonRandomPinClick);
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
    blockMapState: blockMapState,
    assignAddressMapPin: assignAddressMapPin
  };
})();
