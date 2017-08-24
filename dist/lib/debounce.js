"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (func, ms) {
  var tid = void 0;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (tid) {
      clearTimeout(tid);
    }
    tid = setTimeout(function () {
      func.apply(undefined, args);
    }, ms);
  };
};

;