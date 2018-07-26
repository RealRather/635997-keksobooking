'use strict';

/* Cценарии взаимодействия пользователя с формой */
(function () {

  var formAd = document.querySelector('.ad-form');
  var formFieldsets = formAd.querySelectorAll('fieldset');
  var formSelectTimeIn = formAd.querySelector('#timein');
  var formSelectTimeOut = formAd.querySelector('#timeout');
  var formInputAddress = formAd.querySelector('#address');

  var switchStateFieldset = function (fieldsetState) {
    for (var i = 0; i < formFieldsets.length; i++) {
      formFieldsets[i].disabled = fieldsetState;
    }
  };

  // Перeключает состояние у всех fieldset в форме
  switchStateFieldset(true);

  // Синхронизирует время у двух полей
  var synceTime = function (firstTimer, secondTimer) {
    firstTimer.value = secondTimer.value;
  };

  var onSelectTimeInChange = function () {
    synceTime(formSelectTimeOut, formSelectTimeIn);
  };

  var onSelectTimeOutChange = function () {
    synceTime(formSelectTimeIn, formSelectTimeOut);
  };

  // Добавление обработчиков синхронизации времени заезда и выезда
  formSelectTimeIn.addEventListener('change', onSelectTimeInChange);
  formSelectTimeOut.addEventListener('change', onSelectTimeOutChange);

  var displayError = function (errorMessage) {
    var node = document.createElement('div');

    node.style =
      'z-index: 200; ' +
      'margin: 0 auto; ' +
      'padding: 20px 10px; ' +
      'text-align: center; ' +
      'background-color: darkred;'
    ;
    node.style.position = 'fixed';
    node.style.left = '0';
    node.style.right = '0';
    node.style.top = '30%';
    node.style.color = 'white';
    node.style.fontSize = '30px';
    node.style.height = '70px';
    node.style.width = '50%';

    node.textContent = errorMessage;
    document.body.appendChild(node);
  };

  window.form = {
    formAd: formAd,
    formInputAddress: formInputAddress,
    switchStateFieldset: switchStateFieldset,
    displayError: displayError
  };
})();
