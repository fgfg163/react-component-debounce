'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function (defaultOptions, options) {
  var resultOption = (0, _extends3.default)({}, defaultOptions, {
    getValueFromEvent: function getValueFromEvent(e) {
      if (!e || !e.target) {
        return e;
      }
      var target = e.target;

      return target[resultOption.valuePropName];
    }
  });
  if (typeof options === 'number') {
    resultOption = (0, _extends3.default)({}, resultOption, {
      triggerMs: options
    });
    if (typeof (arguments.length <= 3 ? undefined : arguments[3]) === 'boolean') {
      resultOption = (0, _extends3.default)({}, resultOption, {
        uncontroll: arguments.length <= 3 ? undefined : arguments[3]
      });
    }
    if (typeof (arguments.length <= 2 ? undefined : arguments[2]) === 'number') {
      resultOption = (0, _extends3.default)({}, resultOption, {
        valuePropMs: arguments.length <= 2 ? undefined : arguments[2]
      });
    }
  }

  if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object' && !Array.isArray(options)) {
    resultOption = (0, _extends3.default)({}, resultOption, options);
  }

  return resultOption;
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }