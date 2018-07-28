'use strict';

(function () {
  var AMOUNT_ADVERTS = 5;

  //  Добавление данных с сервера
  var getGeneratedAdverts = function () {
    var arrayAdverts = [];
    if (!window.map.globalMap.data) {
      window.backend.requestServerData(function (data) {
        window.map.globalMap.data = data.slice();
        var objectAdvert = window.map.globalMap.data;
        arrayAdverts.push(objectAdvert);
        arrayAdverts.splice(AMOUNT_ADVERTS);
      },
      window.form.displayError
      );
    }
    return arrayAdverts;
  };

  var adverts = getGeneratedAdverts();

  window.generateAdverts = {
    adverts: adverts
  };
})();
