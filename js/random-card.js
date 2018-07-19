'use strict';

(function () {
  var AUXILIARY_ELEMENTS_COUNT = 2;
  var mapContainer = document.querySelector('.map__filters-container');
  var mapPinsElement = globalMap.querySelector('.map__pins');
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
    var randomCard = getGeneratedCard(
        adverts[getIndexNode(documentNode) - AUXILIARY_ELEMENTS_COUNT]
    );
    var popupCardClose = randomCard.querySelector('.popup__close');
    var OnPopupEscPress = function (evt) {
      window.util.isEscKeyCode(evt, closePopup);
    };
    document.addEventListener('keydown', function (evt) {
      window.util.isEnterKeyCode(evt, closePopup);
    });
    popupCardClose.addEventListener('click', function () {
      closePopup();
    });
    var closePopup = function () {
      randomCard.classList.add('hidden');
      document.removeEventListener('keydown', OnPopupEscPress);
    };
    globalMap.insertBefore(randomCard, mapContainer);
  };
  // Добавление обработчика для меток
  mapPinsElement.addEventListener('click', onButtonRandomPinClick);
})();
