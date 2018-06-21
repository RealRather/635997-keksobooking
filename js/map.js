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

var AMOUNT_ADVERTS = 8;
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
  return Math.floor(Math.random() * (max - min) + min);
};

var createDiffArrayLength = function (array) {
  return array.slice(getRandomElement(0, array.length));
};

// Перемешивает массив
var createMixArray = function (array) {
  var mixArray = function () {
    return Math.random() - 0.5;
  };
  return array.sort(mixArray);
};

var generateAdverts = function (countObjects) {
  var arrayAdverts = [];
  for (var i = 0; i < countObjects; i++) {
    var objectAdvert = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: TITLES[i],
        address: location.x + ',' + location.y,
        price: getRandomElement(PRICE_MIN_VALUE, PRICE_MAX_VALUE),
        type: TYPES[getRandomElement(0, TYPES.length)],
        rooms: getRandomElement(ROOMS_MIN_VALUE, ROOMS_MAX_VALUE),
        guests: getRandomElement(GUESTS_MIN_VALUE, GUESTS_MAX_VALUE),
        checkin: ARRIVAL_TIMES[getRandomElement(0, ARRIVAL_TIMES.length)],
        checkout: DEPARTURE_TIMES[getRandomElement(0, DEPARTURE_TIMES.length)],
        features: createDiffArrayLength(FEATURES),
        description: '',
        photos: createMixArray(PHOTOS)
      },

      location: {
        x: getRandomElement(LOCATION_X_MIN, LOCATION_X_MAX),
        y: getRandomElement(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    };
    arrayAdverts.push(objectAdvert);
  }
  return arrayAdverts;
};

var Adverts = generateAdverts(AMOUNT_ADVERTS);


//  Переключает карту в активное состояние
var globalMap = document.querySelector('.map');
globalMap.classList.remove('map--faded');
