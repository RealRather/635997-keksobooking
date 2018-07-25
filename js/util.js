'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    isEscKeyCode: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
