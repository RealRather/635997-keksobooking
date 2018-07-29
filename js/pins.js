'use strict';

(function () {
  var MAP_PIN_WIDTH = 65;
  var MAP_PIN_HEIGHT = 65;

  var templateMapPin = document.querySelector('template').content.querySelector('.map__pin');

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

  var removeAllPins = function () {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (element) {
      element.remove();
    });
  };

  window.pins = {
    MAP_PIN_WIDTH: MAP_PIN_WIDTH,
    MAP_PIN_HEIGHT: MAP_PIN_HEIGHT,
    createPins: createPins,
    removeAllPins: removeAllPins
  };
})();

