import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
export default function (defaultOptions, options) {
  var resultOption = _extends({}, defaultOptions, {
    getValueFromEvent: function getValueFromEvent(e) {
      if (!e || !e.target) {
        return e;
      }
      var target = e.target;

      return target[resultOption.valuePropName];
    }
  });
  if (typeof options === 'number') {
    resultOption = _extends({}, resultOption, {
      triggerMs: options
    });
    if (typeof (arguments.length <= 3 ? undefined : arguments[3]) === 'boolean') {
      resultOption = _extends({}, resultOption, {
        uncontroll: arguments.length <= 3 ? undefined : arguments[3]
      });
    }
    if (typeof (arguments.length <= 2 ? undefined : arguments[2]) === 'number') {
      resultOption = _extends({}, resultOption, {
        valuePropMs: arguments.length <= 2 ? undefined : arguments[2]
      });
    }
  }

  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && !Array.isArray(options)) {
    resultOption = _extends({}, resultOption, options);
  }

  return resultOption;
}