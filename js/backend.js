'use strict';

// Обработка запросов сервера
(function () {
  var STATUS_RESPONSE = 200;
  var TIMEOUT = 7000;
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var GET_URL = 'https://js.dump.academy/keksobooking/data';

  var requestServerData = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_RESPONSE) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('За отведенное время: ' + xhr.timeout + 'мс, запрос не успел выполниться');
    });

    xhr.timeout = TIMEOUT;

    if (!data) {
      xhr.open('GET', GET_URL);
    } else {
      xhr.open('POST', POST_URL);
    }

    xhr.send(data);
  };

  window.backend = {
    requestServerData: requestServerData
  };
})();
