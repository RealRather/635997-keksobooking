'use strict';

(function () {
  var BUILDING_TYPES = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var templateMapCard = document.querySelector('template').content.querySelector('.map__card');
  var templatePhoto = templateMapCard.querySelector('.popup__photo');

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

  // Создание карточки
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

    var popupCardClose = mapCard.querySelector('.popup__close');
    var popupCard = window.map.globalMap.querySelector('.map__card');

    if (!popupCard) {
      window.map.globalMap.insertBefore(mapCard, window.map.mapContainer);
    } else {
      window.map.globalMap.replaceChild(mapCard, popupCard);
    }

    var onPopupEscPress = function (evt) {
      window.util.isEscKeyCode(evt, closePopup);
    };

    document.addEventListener('keydown', onPopupEscPress);

    var closePopup = function () {
      mapCard.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    };

    popupCardClose.addEventListener('click', function () {
      closePopup();
    });
    return mapCard;
  };

  window.createCard = {
    getGeneratedCard: getGeneratedCard
  };
})();
