'use strict';

var PRICE_MIN_VALUE = 1000;
var PRICE_MAX_VALUE = 1000000;

var ROOMS_MIN_VALUE = 1;
var ROOMS_MAX_VALUE = 5;

var GUESTS_MIN_VALUE = 1;
var GUESTS_MAX_VALUE = 25;

var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;

var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var AMOUNT_CARDS = 8;
var TITLES =
  [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ARRIVAL_TIMES = ['12:00', '13:00', '14:00'];
var DEPARTURE_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS =
  [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

var getRandomElement = function (min, max) {
  return Math.floor(Math.randon() * (max - min) + min);
};

var createMixArray = function (array) {
  var mixArray = function () {
    return Math.random() - 0.5;
  };
  return array.sort(mixArray);
};

var globalMap = document.querySelector('.map');
globalMap.classList.remove('map--faded');
