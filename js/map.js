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
var AUXILIARY_ELEMENTS_COUNT = 2;

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
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

var BUILDING_TYPES = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var globalMap = document.querySelector('.map');
var mapPinsElement = globalMap.querySelector('.map__pins');
var mapContainer = document.querySelector('.map__filters-container');
var mapMainPin = document.querySelector('.map__pin--main');

var templateMapPin = document.querySelector('template').content.querySelector('.map__pin');
var templateMapCard = document.querySelector('template').content.querySelector('.map__card');
var templatePhoto = templateMapCard.querySelector('.popup__photo');

var formAd = document.querySelector('.ad-form');
var formFieldsets = formAd.querySelectorAll('fieldset');
var formInputAddress = formAd.querySelector('#address');

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

// Генерация объявлений
var generateAdverts = function (countObjects) {
  var arrayAdverts = [];
  for (var i = 0; i < countObjects; i++) {
    var yPoint = getRandomElement(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var xPoint = getRandomElement(LOCATION_X_MIN, LOCATION_X_MAX);
    var objectAdvert = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: TITLES[i],
        address: xPoint + ', ' + yPoint,
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
        x: xPoint,
        y: yPoint
      }
    };
    arrayAdverts.push(objectAdvert);
  }
  return arrayAdverts;
};

var adverts = generateAdverts(AMOUNT_ADVERTS);

// Создание списка фотографий в объявлении
var renderPhotoAdvert = function (arrayPhotos) {
  var fragmentPhoto = document.createDocumentFragment();
  for (var i = 0; i < arrayPhotos.length; i++) {
    var newPhoto = templatePhoto.cloneNode();
    newPhoto.src = arrayPhotos[i];
    fragmentPhoto.appendChild(newPhoto);
  }
  return fragmentPhoto;
};

// Создание списка удобств в объявлении
var renderFeaturesAdvert = function (arrayFeatures) {
  var fragmentFeature = document.createDocumentFragment();
  for (var i = 0; i < arrayFeatures.length; i++) {
    var newTag = document.createElement('li');
    newTag.classList.add('popup__feature');
    newTag.classList.add('popup__feature--' + arrayFeatures[i]);
    fragmentFeature.appendChild(newTag);
  }
  return fragmentFeature;
};

// Создание метки в объявлении
var getGeneratedPinAdvert = function (mapPin) {
  var pinAdvert = templateMapPin.cloneNode(true);
  pinAdvert.style.top = mapPin.location.y - MAP_PIN_HEIGHT + 'px';
  pinAdvert.style.left = mapPin.location.x - MAP_PIN_WIDTH / 2 + 'px';
  pinAdvert.querySelector('img').alt = mapPin.offer.title;
  pinAdvert.querySelector('img').src = mapPin.author.avatar;
  return pinAdvert;
};

// Отрисовка карточки
var getGeneratedCard = function (objAdvert) {
  var mapCard = templateMapCard.cloneNode(true);
  var popupFeatures = mapCard.querySelector('.popup__features');
  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }
  mapCard.querySelector('.popup__title').textContent = objAdvert.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = objAdvert.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = objAdvert.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = BUILDING_TYPES[objAdvert.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = objAdvert.offer.rooms + ' комнаты для ' + objAdvert.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + objAdvert.offer.checkin + ', выезд до ' + objAdvert.offer.checkout;
  mapCard.querySelector('.popup__features').appendChild(renderFeaturesAdvert(objAdvert.offer.features));
  mapCard.querySelector('.popup__description').textContent = objAdvert.offer.description;
  mapCard.querySelector('.popup__photos').innerHTML = '';
  mapCard.querySelector('.popup__photos').appendChild(renderPhotoAdvert(objAdvert.offer.photos));
  mapCard.querySelector('.popup__avatar').src = objAdvert.author.avatar;

  return mapCard;
};

// Добавляет метки на страницу
var createPins = function (arrayAdverts) {
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < arrayAdverts.length; i++) {
    pinFragment.appendChild(getGeneratedPinAdvert(arrayAdverts[i]));
  }
  return pinFragment;
};

var onButtonMainPinMouseUp = function () {
  for (var i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].disabled = false;
  }
  // Переключает карту в активное состояние
  globalMap.classList.remove('map--faded');
  // Разблокирует поля формы
  formAd.classList.remove('ad-form--disabled');

  mapPinsElement.appendChild(createPins(adverts));
  mapMainPin.removeEventListener('mouseup', onButtonMainPinMouseUp);
};

// Получает индекс узла
var getIndexNode = function (documentNode) {
  var indexNode;
  var nodes = Array.prototype.slice.call(documentNode.parentNode.children);
  indexNode = nodes.indexOf(documentNode);
  return indexNode;
};

var onButtonRandomPinClick = function (evt) {
  var documentNode = evt.target.closest('button');
  if (!documentNode || documentNode.classList.contains('map__pin--main')) {
    return;
  }
  globalMap.insertBefore(getGeneratedCard(adverts[getIndexNode(documentNode) - AUXILIARY_ELEMENTS_COUNT]), mapContainer);
};

// Добавление обработчиков для карты и меток
mapMainPin.addEventListener('mouseup', onButtonMainPinMouseUp);
mapPinsElement.addEventListener('click', onButtonRandomPinClick);
