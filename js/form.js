'use strict';

/* Cценарии взаимодействия пользователя с формой */
(function () {

  window.formAd = document.querySelector('.ad-form');
  var formFieldsets = document.querySelectorAll('fieldset');
  var formSelectTimeIn = document.querySelector('#timein');
  var formSelectTimeOut = document.querySelector('#timeout');

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

  window.form = {
    switchStateFieldset: switchStateFieldset
  };
})();
