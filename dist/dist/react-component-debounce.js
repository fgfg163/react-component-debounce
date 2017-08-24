'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  triggerMs: 0,
  trigger: 'onChange',
  valuePropMs: 0,
  valuePropName: 'value',
  uncontroll: false,
  getValueFromEvent: function getValueFromEvent(e) {
    return e;
  },
  shouldComponentUpdate: undefined
};
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _debounce = require('./debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _shouldUpdate = require('./should-update');

var _shouldUpdate2 = _interopRequireDefault(_shouldUpdate);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _config2.default;

  var theOptions = (0, _extends3.default)({}, _config2.default, {
    getValueFromEvent: function getValueFromEvent(e) {
      if (!e || !e.target) {
        return e;
      }
      var target = e.target;

      return target[theOptions.valuePropName];
    }
  });

  if (typeof options === 'number') {
    theOptions = (0, _extends3.default)({}, theOptions, {
      triggerMs: options
    });
    if (typeof (arguments.length <= 2 ? undefined : arguments[2]) === 'boolean') {
      theOptions = (0, _extends3.default)({}, theOptions, {
        uncontroll: arguments.length <= 2 ? undefined : arguments[2]
      });
    }
    if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'number') {
      theOptions = (0, _extends3.default)({}, theOptions, {
        valuePropMs: arguments.length <= 1 ? undefined : arguments[1]
      });
    }
  }

  if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object' && !Array.isArray(options)) {
    theOptions = (0, _extends3.default)({}, theOptions, options);
  }

  return function (ReactElement) {
    var ReactFormFieldDebounce = function (_React$Component) {
      (0, _inherits3.default)(ReactFormFieldDebounce, _React$Component);

      function ReactFormFieldDebounce(props) {
        (0, _classCallCheck3.default)(this, ReactFormFieldDebounce);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ReactFormFieldDebounce.__proto__ || (0, _getPrototypeOf2.default)(ReactFormFieldDebounce)).call(this, props));

        _this.onChange = function () {
          var updb = _this.props[theOptions.trigger];
          if (theOptions.triggerMs >= 0) {
            updb = (0, _debounce2.default)(function (value) {
              _this.props[theOptions.trigger](value);
            }, theOptions.triggerMs);
          }
          return updb;
        }();

        _this.handleOnChange = function (event) {
          var value = theOptions.getValueFromEvent(event);
          if (!theOptions.uncontroll) {
            _this.setState((0, _defineProperty3.default)({}, theOptions.valuePropName, value));
          }
          _this.lastValue = value;
          _this.onChange(value);
          if (event && event.target) {
            theOptions.uncontroll = false;
          }
        };

        _this.valueUpdateDebounce = function () {
          if (theOptions.valuePropMs >= 0) {
            return (0, _debounce2.default)(function (value) {
              _this.lastValue = value;
              _this.setState((0, _defineProperty3.default)({}, theOptions.valuePropName, value));
            }, theOptions.valuePropMs);
          }
          return function (value) {
            _this.lastValue = value;
            _this.setState((0, _defineProperty3.default)({}, theOptions.valuePropName, value));
          };
        }();

        _this.isMount = false;
        _this.lastValue = '';
        _this.shouldUpdatePropsList = function () {
          var thePropsList = (0, _keys2.default)(ReactElement.propTypes || {});
          if (thePropsList.length === 0) {
            thePropsList = (0, _keys2.default)(props || {});
          }
          return thePropsList.filter(function (e) {
            return e !== theOptions.valuePropName;
          }).filter(function (e) {
            return e !== theOptions.trigger;
          }).filter(function (e) {
            return !e.match(/^data-/);
          }).filter(function (e) {
            return typeof props[e] !== 'function';
          });
        }();
        _this.state = {};
        if (Object.prototype.hasOwnProperty.call(props, theOptions.valuePropName)) {
          _this.state[theOptions.valuePropName] = props[theOptions.valuePropName];
          _this.lastValue = props[theOptions.valuePropName];
        }
        return _this;
      }

      (0, _createClass3.default)(ReactFormFieldDebounce, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.isMount = true;
          var self = this;
          if (theOptions.uncontroll) {
            self.setState((0, _defineProperty3.default)({}, theOptions.valuePropName, undefined));
          }
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if ((0, _shouldUpdate2.default)([theOptions.valuePropName], this.props, nextProps)) {
            if (this.lastValue !== nextProps[theOptions.valuePropName]) {
              this.valueUpdateDebounce(nextProps[theOptions.valuePropName]);
            }
          }
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          if (theOptions.shouldComponentUpdate) {
            return theOptions.shouldComponentUpdate.call({
              state: this.state,
              props: this.props
            }, nextProps, nextState);
          }
          if (this.state !== nextState) {
            return true;
          }
          if ((0, _shouldUpdate2.default)(this.shouldUpdatePropsList, this.props, nextProps)) {
            return true;
          }

          return false;
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          var self = this;
          if (theOptions.uncontroll) {
            if (typeof this.state[theOptions.valuePropName] !== 'undefined') {
              self.setState((0, _defineProperty3.default)({}, theOptions.valuePropName, undefined));
            }
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.isMount = false;
        }
      }, {
        key: 'render',
        value: function render() {
          var theProps = (0, _extends3.default)({}, this.props, this.state);
          if (theOptions.uncontroll) {
            if (typeof theProps[theOptions.valuePropName] === 'undefined') {
              delete theProps[theOptions.valuePropName];
            }
          }
          if (Object.prototype.hasOwnProperty.call(theProps, theOptions.trigger)) {
            theProps[theOptions.trigger] = this.handleOnChange;
          }

          return _react2.default.createElement(ReactElement, theProps);
        }
      }]);
      return ReactFormFieldDebounce;
    }(_react2.default.Component);

    ReactFormFieldDebounce.defaultProps = ReactElement.defaultProps;
    ReactFormFieldDebounce.propTypes = ReactElement.propTypes;
    ReactFormFieldDebounce.displayName = 'ReactFormFieldDebounce(' + ReactElement.name + ')';

    return ReactFormFieldDebounce;
  };
};
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (list, thisProps, nextProps) {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  if ((typeof thisProps === 'undefined' ? 'undefined' : (0, _typeof3.default)(thisProps)) !== 'object' || (typeof nextProps === 'undefined' ? 'undefined' : (0, _typeof3.default)(nextProps)) !== 'object') {
    return false;
  }
  return list.some(function (e) {
    return thisProps[e] !== nextProps[e];
  });
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImRlYm91bmNlLmpzIiwiaW5kZXguanN4IiwibWVyZ2UtY29uZmlnLmpzIiwic2hvdWxkLXVwZGF0ZS5qcyJdLCJuYW1lcyI6WyJ0cmlnZ2VyTXMiLCJ0cmlnZ2VyIiwidmFsdWVQcm9wTXMiLCJ2YWx1ZVByb3BOYW1lIiwidW5jb250cm9sbCIsImdldFZhbHVlRnJvbUV2ZW50IiwiZSIsInNob3VsZENvbXBvbmVudFVwZGF0ZSIsInVuZGVmaW5lZCIsImZ1bmMiLCJtcyIsInRpZCIsImFyZ3MiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0Iiwib3B0aW9ucyIsInRoZU9wdGlvbnMiLCJ0YXJnZXQiLCJBcnJheSIsImlzQXJyYXkiLCJSZWFjdEVsZW1lbnQiLCJSZWFjdEZvcm1GaWVsZERlYm91bmNlIiwicHJvcHMiLCJvbkNoYW5nZSIsInVwZGIiLCJ2YWx1ZSIsImhhbmRsZU9uQ2hhbmdlIiwiZXZlbnQiLCJzZXRTdGF0ZSIsImxhc3RWYWx1ZSIsInZhbHVlVXBkYXRlRGVib3VuY2UiLCJpc01vdW50Iiwic2hvdWxkVXBkYXRlUHJvcHNMaXN0IiwidGhlUHJvcHNMaXN0IiwicHJvcFR5cGVzIiwibGVuZ3RoIiwiZmlsdGVyIiwibWF0Y2giLCJzdGF0ZSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsInNlbGYiLCJuZXh0UHJvcHMiLCJuZXh0U3RhdGUiLCJ0aGVQcm9wcyIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsImRpc3BsYXlOYW1lIiwibmFtZSIsImRlZmF1bHRPcHRpb25zIiwicmVzdWx0T3B0aW9uIiwibGlzdCIsInRoaXNQcm9wcyIsInNvbWUiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUFlO0FBQ2JBLGFBQVcsQ0FERTtBQUViQyxXQUFTLFVBRkk7QUFHYkMsZUFBYSxDQUhBO0FBSWJDLGlCQUFlLE9BSkY7QUFLYkMsY0FBWSxLQUxDO0FBTWJDLHFCQUFtQjtBQUFBLFdBQUtDLENBQUw7QUFBQSxHQU5OO0FBT2JDLHlCQUF1QkM7QUFQVjs7Ozs7OztrQkNBQSxVQUFVQyxJQUFWLEVBQWdCQyxFQUFoQixFQUFvQjtBQUNqQyxNQUFJQyxZQUFKO0FBQ0EsU0FBTyxZQUFhO0FBQUEsc0NBQVRDLElBQVM7QUFBVEEsVUFBUztBQUFBOztBQUNsQixRQUFJRCxHQUFKLEVBQVM7QUFDUEUsbUJBQWFGLEdBQWI7QUFDRDtBQUNEQSxVQUFNRyxXQUFXLFlBQU07QUFDckJMLDRCQUFRRyxJQUFSO0FBQ0QsS0FGSyxFQUVIRixFQUZHLENBQU47QUFHRCxHQVBEO0FBUUQ7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWRDs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVlLFlBQTRDO0FBQUEsTUFBM0NLLE9BQTJDOztBQUN6RCxNQUFJQztBQUVGWCx1QkFBbUIsMkJBQUNDLENBQUQsRUFBTztBQUN4QixVQUFJLENBQUNBLENBQUQsSUFBTSxDQUFDQSxFQUFFVyxNQUFiLEVBQXFCO0FBQ25CLGVBQU9YLENBQVA7QUFDRDtBQUh1QixVQUloQlcsTUFKZ0IsR0FJTFgsQ0FKSyxDQUloQlcsTUFKZ0I7O0FBS3hCLGFBQU9BLE9BQU9ELFdBQVdiLGFBQWxCLENBQVA7QUFDRDtBQVJDLElBQUo7O0FBV0EsTUFBSSxPQUFRWSxPQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDQyw0Q0FDS0EsVUFETDtBQUVFaEIsaUJBQVdlO0FBRmI7QUFJQSxRQUFJLDhEQUEwQixTQUE5QixFQUF5QztBQUN2Q0MsOENBQ0tBLFVBREw7QUFFRVo7QUFGRjtBQUlEO0FBQ0QsUUFBSSw4REFBMEIsUUFBOUIsRUFBd0M7QUFDdENZLDhDQUNLQSxVQURMO0FBRUVkO0FBRkY7QUFJRDtBQUNGOztBQUVELE1BQUksUUFBUWEsT0FBUix1REFBUUEsT0FBUixPQUFxQixRQUFyQixJQUFpQyxDQUFDRyxNQUFNQyxPQUFOLENBQWNKLE9BQWQsQ0FBdEMsRUFBOEQ7QUFDNURDLDRDQUNLQSxVQURMLEVBRUtELE9BRkw7QUFJRDs7QUFFRCxTQUFPLFVBQUNLLFlBQUQsRUFBa0I7QUFBQSxRQUNqQkMsc0JBRGlCO0FBQUE7O0FBRXJCLHNDQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsMEtBQ1hBLEtBRFc7O0FBQUEsY0FxRW5CQyxRQXJFbUIsR0FxRVAsWUFBTTtBQUNoQixjQUFJQyxPQUFPLE1BQUtGLEtBQUwsQ0FBV04sV0FBV2YsT0FBdEIsQ0FBWDtBQUNBLGNBQUllLFdBQVdoQixTQUFYLElBQXdCLENBQTVCLEVBQStCO0FBQzdCd0IsbUJBQU8sd0JBQVMsVUFBQ0MsS0FBRCxFQUFXO0FBQ3pCLG9CQUFLSCxLQUFMLENBQVdOLFdBQVdmLE9BQXRCLEVBQStCd0IsS0FBL0I7QUFDRCxhQUZNLEVBRUpULFdBQVdoQixTQUZQLENBQVA7QUFHRDtBQUNELGlCQUFPd0IsSUFBUDtBQUNELFNBUlUsRUFyRVE7O0FBQUEsY0ErRW5CRSxjQS9FbUIsR0ErRUYsVUFBQ0MsS0FBRCxFQUFXO0FBQzFCLGNBQU1GLFFBQVFULFdBQVdYLGlCQUFYLENBQTZCc0IsS0FBN0IsQ0FBZDtBQUNBLGNBQUksQ0FBQ1gsV0FBV1osVUFBaEIsRUFBNEI7QUFDMUIsa0JBQUt3QixRQUFMLG1DQUFpQlosV0FBV2IsYUFBNUIsRUFBNENzQixLQUE1QztBQUNEO0FBQ0QsZ0JBQUtJLFNBQUwsR0FBaUJKLEtBQWpCO0FBQ0EsZ0JBQUtGLFFBQUwsQ0FBY0UsS0FBZDtBQUNBLGNBQUlFLFNBQVNBLE1BQU1WLE1BQW5CLEVBQTJCO0FBQ3pCRCx1QkFBV1osVUFBWCxHQUF3QixLQUF4QjtBQUNEO0FBQ0YsU0F6RmtCOztBQUFBLGNBMkZuQjBCLG1CQTNGbUIsR0EyRkksWUFBTTtBQUMzQixjQUFJZCxXQUFXZCxXQUFYLElBQTBCLENBQTlCLEVBQWlDO0FBQy9CLG1CQUFPLHdCQUFTLFVBQUN1QixLQUFELEVBQVc7QUFDekIsb0JBQUtJLFNBQUwsR0FBaUJKLEtBQWpCO0FBQ0Esb0JBQUtHLFFBQUwsbUNBQWlCWixXQUFXYixhQUE1QixFQUE0Q3NCLEtBQTVDO0FBQ0QsYUFITSxFQUdKVCxXQUFXZCxXQUhQLENBQVA7QUFJRDtBQUNELGlCQUFPLFVBQUN1QixLQUFELEVBQVc7QUFDaEIsa0JBQUtJLFNBQUwsR0FBaUJKLEtBQWpCO0FBQ0Esa0JBQUtHLFFBQUwsbUNBQWlCWixXQUFXYixhQUE1QixFQUE0Q3NCLEtBQTVDO0FBQ0QsV0FIRDtBQUlELFNBWHFCLEVBM0ZIOztBQUVqQixjQUFLTSxPQUFMLEdBQWUsS0FBZjtBQUNBLGNBQUtGLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxjQUFLRyxxQkFBTCxHQUE4QixZQUFNO0FBQ2xDLGNBQUlDLGVBQWUsb0JBQVliLGFBQWFjLFNBQWIsSUFBMEIsRUFBdEMsQ0FBbkI7QUFDQSxjQUFJRCxhQUFhRSxNQUFiLEtBQXdCLENBQTVCLEVBQStCO0FBQzdCRiwyQkFBZSxvQkFBWVgsU0FBUyxFQUFyQixDQUFmO0FBQ0Q7QUFDRCxpQkFBT1csYUFDSkcsTUFESSxDQUNHO0FBQUEsbUJBQUs5QixNQUFNVSxXQUFXYixhQUF0QjtBQUFBLFdBREgsRUFFSmlDLE1BRkksQ0FFRztBQUFBLG1CQUFLOUIsTUFBTVUsV0FBV2YsT0FBdEI7QUFBQSxXQUZILEVBR0ptQyxNQUhJLENBR0c7QUFBQSxtQkFBSyxDQUFDOUIsRUFBRStCLEtBQUYsQ0FBUSxRQUFSLENBQU47QUFBQSxXQUhILEVBSUpELE1BSkksQ0FJRztBQUFBLG1CQUFLLE9BQVFkLE1BQU1oQixDQUFOLENBQVIsS0FBc0IsVUFBM0I7QUFBQSxXQUpILENBQVA7QUFLRCxTQVY0QixFQUE3QjtBQVdBLGNBQUtnQyxLQUFMLEdBQWEsRUFBYjtBQUNBLFlBQUlDLE9BQU9DLFNBQVAsQ0FBaUJDLGNBQWpCLENBQWdDQyxJQUFoQyxDQUFxQ3BCLEtBQXJDLEVBQTRDTixXQUFXYixhQUF2RCxDQUFKLEVBQTJFO0FBQ3pFLGdCQUFLbUMsS0FBTCxDQUFXdEIsV0FBV2IsYUFBdEIsSUFBdUNtQixNQUFNTixXQUFXYixhQUFqQixDQUF2QztBQUNBLGdCQUFLMEIsU0FBTCxHQUFpQlAsTUFBTU4sV0FBV2IsYUFBakIsQ0FBakI7QUFDRDtBQW5CZ0I7QUFvQmxCOztBQXRCb0I7QUFBQTtBQUFBLDRDQXdCRDtBQUNsQixlQUFLNEIsT0FBTCxHQUFlLElBQWY7QUFDQSxjQUFNWSxPQUFPLElBQWI7QUFDQSxjQUFJM0IsV0FBV1osVUFBZixFQUEyQjtBQUN6QnVDLGlCQUFLZixRQUFMLG1DQUFpQlosV0FBV2IsYUFBNUIsRUFBNENLLFNBQTVDO0FBQ0Q7QUFDRjtBQTlCb0I7QUFBQTtBQUFBLGtEQWdDS29DLFNBaENMLEVBZ0NnQjtBQUNuQyxjQUFJLDRCQUFhLENBQUM1QixXQUFXYixhQUFaLENBQWIsRUFBeUMsS0FBS21CLEtBQTlDLEVBQXFEc0IsU0FBckQsQ0FBSixFQUFxRTtBQUNuRSxnQkFBSSxLQUFLZixTQUFMLEtBQW1CZSxVQUFVNUIsV0FBV2IsYUFBckIsQ0FBdkIsRUFBNEQ7QUFDMUQsbUJBQUsyQixtQkFBTCxDQUF5QmMsVUFBVTVCLFdBQVdiLGFBQXJCLENBQXpCO0FBQ0Q7QUFDRjtBQUNGO0FBdENvQjtBQUFBO0FBQUEsOENBd0NDeUMsU0F4Q0QsRUF3Q1lDLFNBeENaLEVBd0N1QjtBQUMxQyxjQUFJN0IsV0FBV1QscUJBQWYsRUFBc0M7QUFDcEMsbUJBQU9TLFdBQVdULHFCQUFYLENBQWlDbUMsSUFBakMsQ0FBc0M7QUFDM0NKLHFCQUFPLEtBQUtBLEtBRCtCO0FBRTNDaEIscUJBQU8sS0FBS0E7QUFGK0IsYUFBdEMsRUFHSnNCLFNBSEksRUFHT0MsU0FIUCxDQUFQO0FBSUQ7QUFDRCxjQUFJLEtBQUtQLEtBQUwsS0FBZU8sU0FBbkIsRUFBOEI7QUFDNUIsbUJBQU8sSUFBUDtBQUNEO0FBQ0QsY0FBSSw0QkFBYSxLQUFLYixxQkFBbEIsRUFBeUMsS0FBS1YsS0FBOUMsRUFBcURzQixTQUFyRCxDQUFKLEVBQXFFO0FBQ25FLG1CQUFPLElBQVA7QUFDRDs7QUFFRCxpQkFBTyxLQUFQO0FBQ0Q7QUF2RG9CO0FBQUE7QUFBQSw2Q0F5REE7QUFDbkIsY0FBTUQsT0FBTyxJQUFiO0FBQ0EsY0FBSTNCLFdBQVdaLFVBQWYsRUFBMkI7QUFDekIsZ0JBQUksT0FBUSxLQUFLa0MsS0FBTCxDQUFXdEIsV0FBV2IsYUFBdEIsQ0FBUixLQUFrRCxXQUF0RCxFQUFtRTtBQUNqRXdDLG1CQUFLZixRQUFMLG1DQUFpQlosV0FBV2IsYUFBNUIsRUFBNENLLFNBQTVDO0FBQ0Q7QUFDRjtBQUNGO0FBaEVvQjtBQUFBO0FBQUEsK0NBa0VFO0FBQ3JCLGVBQUt1QixPQUFMLEdBQWUsS0FBZjtBQUNEO0FBcEVvQjtBQUFBO0FBQUEsaUNBMEdaO0FBQ1AsY0FBTWUsc0NBQ0QsS0FBS3hCLEtBREosRUFFRCxLQUFLZ0IsS0FGSixDQUFOO0FBSUEsY0FBSXRCLFdBQVdaLFVBQWYsRUFBMkI7QUFDekIsZ0JBQUksT0FBUTBDLFNBQVM5QixXQUFXYixhQUFwQixDQUFSLEtBQWdELFdBQXBELEVBQWlFO0FBQy9ELHFCQUFPMkMsU0FBUzlCLFdBQVdiLGFBQXBCLENBQVA7QUFDRDtBQUNGO0FBQ0QsY0FBSW9DLE9BQU9DLFNBQVAsQ0FBaUJDLGNBQWpCLENBQWdDQyxJQUFoQyxDQUFxQ0ksUUFBckMsRUFBK0M5QixXQUFXZixPQUExRCxDQUFKLEVBQXdFO0FBQ3RFNkMscUJBQVM5QixXQUFXZixPQUFwQixJQUErQixLQUFLeUIsY0FBcEM7QUFDRDs7QUFFRCxpQkFBUSw4QkFBQyxZQUFELEVBQWtCb0IsUUFBbEIsQ0FBUjtBQUNEO0FBekhvQjtBQUFBO0FBQUEsTUFDYyxnQkFBTUMsU0FEcEI7O0FBNEh2QjFCLDJCQUF1QjJCLFlBQXZCLEdBQXNDNUIsYUFBYTRCLFlBQW5EO0FBQ0EzQiwyQkFBdUJhLFNBQXZCLEdBQW1DZCxhQUFhYyxTQUFoRDtBQUNBYiwyQkFBdUI0QixXQUF2QiwrQkFBK0Q3QixhQUFhOEIsSUFBNUU7O0FBRUEsV0FBTzdCLHNCQUFQO0FBQ0QsR0FqSUQ7QUFrSUQ7Ozs7Ozs7Ozs7Ozs7OztrQkM3S2MsVUFBVThCLGNBQVYsRUFBMEJwQyxPQUExQixFQUE0QztBQUN6RCxNQUFJcUMsMENBQ0NELGNBREQ7QUFFRjlDLHVCQUFtQiwyQkFBQ0MsQ0FBRCxFQUFPO0FBQ3hCLFVBQUksQ0FBQ0EsQ0FBRCxJQUFNLENBQUNBLEVBQUVXLE1BQWIsRUFBcUI7QUFDbkIsZUFBT1gsQ0FBUDtBQUNEO0FBSHVCLFVBSWhCVyxNQUpnQixHQUlMWCxDQUpLLENBSWhCVyxNQUpnQjs7QUFLeEIsYUFBT0EsT0FBT21DLGFBQWFqRCxhQUFwQixDQUFQO0FBQ0Q7QUFSQyxJQUFKO0FBVUEsTUFBSSxPQUFRWSxPQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDcUMsOENBQ0tBLFlBREw7QUFFRXBELGlCQUFXZTtBQUZiO0FBSUEsUUFBSSw4REFBcUIsU0FBekIsRUFBb0M7QUFDbENxQyxnREFDS0EsWUFETDtBQUVFaEQ7QUFGRjtBQUlEO0FBQ0QsUUFBSSw4REFBcUIsUUFBekIsRUFBbUM7QUFDakNnRCxnREFDS0EsWUFETDtBQUVFbEQ7QUFGRjtBQUlEO0FBQ0Y7O0FBRUQsTUFBSSxRQUFRYSxPQUFSLHVEQUFRQSxPQUFSLE9BQXFCLFFBQXJCLElBQWlDLENBQUNHLE1BQU1DLE9BQU4sQ0FBY0osT0FBZCxDQUF0QyxFQUE4RDtBQUM1RHFDLDhDQUNLQSxZQURMLEVBRUtyQyxPQUZMO0FBSUQ7O0FBRUQsU0FBT3FDLFlBQVA7QUFDRDs7Ozs7Ozs7Ozs7Ozs7O2tCQ3RDYyxVQUFDQyxJQUFELEVBQU9DLFNBQVAsRUFBa0JWLFNBQWxCLEVBQWdDO0FBQzdDLE1BQUksQ0FBQzFCLE1BQU1DLE9BQU4sQ0FBY2tDLElBQWQsQ0FBRCxJQUF3QkEsS0FBS2xCLE1BQUwsS0FBZ0IsQ0FBNUMsRUFBK0M7QUFDN0MsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxNQUFJLFFBQVFtQixTQUFSLHVEQUFRQSxTQUFSLE9BQXVCLFFBQXZCLElBQW1DLFFBQVFWLFNBQVIsdURBQVFBLFNBQVIsT0FBdUIsUUFBOUQsRUFBd0U7QUFDdEUsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPUyxLQUFLRSxJQUFMLENBQVU7QUFBQSxXQUFLRCxVQUFVaEQsQ0FBVixNQUFpQnNDLFVBQVV0QyxDQUFWLENBQXRCO0FBQUEsR0FBVixDQUFQO0FBQ0QiLCJmaWxlIjoicmVhY3QtY29tcG9uZW50LWRlYm91bmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICB0cmlnZ2VyTXM6IDAsXG4gIHRyaWdnZXI6ICdvbkNoYW5nZScsXG4gIHZhbHVlUHJvcE1zOiAwLFxuICB2YWx1ZVByb3BOYW1lOiAndmFsdWUnLFxuICB1bmNvbnRyb2xsOiBmYWxzZSxcbiAgZ2V0VmFsdWVGcm9tRXZlbnQ6IGUgPT4gZSxcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiB1bmRlZmluZWQsXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGZ1bmMsIG1zKSB7XG4gIGxldCB0aWQ7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGlmICh0aWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aWQpO1xuICAgIH1cbiAgICB0aWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgfSwgbXMpO1xuICB9O1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnLi9kZWJvdW5jZSc7XG5pbXBvcnQgc2hvdWxkVXBkYXRlIGZyb20gJy4vc2hvdWxkLXVwZGF0ZSc7XG5pbXBvcnQgZGVmYXVsdE9wdGlvbnMgZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgZGVmYXVsdCAob3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zLCAuLi5yZXN0UGFyYW0pID0+IHtcbiAgbGV0IHRoZU9wdGlvbnMgPSB7XG4gICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgZ2V0VmFsdWVGcm9tRXZlbnQ6IChlKSA9PiB7XG4gICAgICBpZiAoIWUgfHwgIWUudGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IGU7XG4gICAgICByZXR1cm4gdGFyZ2V0W3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV07XG4gICAgfSxcbiAgfTtcblxuICBpZiAodHlwZW9mIChvcHRpb25zKSA9PT0gJ251bWJlcicpIHtcbiAgICB0aGVPcHRpb25zID0ge1xuICAgICAgLi4udGhlT3B0aW9ucyxcbiAgICAgIHRyaWdnZXJNczogb3B0aW9ucyxcbiAgICB9O1xuICAgIGlmICh0eXBlb2YgKHJlc3RQYXJhbVsxXSkgPT09ICdib29sZWFuJykge1xuICAgICAgdGhlT3B0aW9ucyA9IHtcbiAgICAgICAgLi4udGhlT3B0aW9ucyxcbiAgICAgICAgdW5jb250cm9sbDogcmVzdFBhcmFtWzFdLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiAocmVzdFBhcmFtWzBdKSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoZU9wdGlvbnMgPSB7XG4gICAgICAgIC4uLnRoZU9wdGlvbnMsXG4gICAgICAgIHZhbHVlUHJvcE1zOiByZXN0UGFyYW1bMF0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgKG9wdGlvbnMpID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xuICAgIHRoZU9wdGlvbnMgPSB7XG4gICAgICAuLi50aGVPcHRpb25zLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIChSZWFjdEVsZW1lbnQpID0+IHtcbiAgICBjbGFzcyBSZWFjdEZvcm1GaWVsZERlYm91bmNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5pc01vdW50ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gJyc7XG4gICAgICAgIHRoaXMuc2hvdWxkVXBkYXRlUHJvcHNMaXN0ID0gKCgpID0+IHtcbiAgICAgICAgICBsZXQgdGhlUHJvcHNMaXN0ID0gT2JqZWN0LmtleXMoUmVhY3RFbGVtZW50LnByb3BUeXBlcyB8fCB7fSk7XG4gICAgICAgICAgaWYgKHRoZVByb3BzTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoZVByb3BzTGlzdCA9IE9iamVjdC5rZXlzKHByb3BzIHx8IHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoZVByb3BzTGlzdFxuICAgICAgICAgICAgLmZpbHRlcihlID0+IGUgIT09IHRoZU9wdGlvbnMudmFsdWVQcm9wTmFtZSlcbiAgICAgICAgICAgIC5maWx0ZXIoZSA9PiBlICE9PSB0aGVPcHRpb25zLnRyaWdnZXIpXG4gICAgICAgICAgICAuZmlsdGVyKGUgPT4gIWUubWF0Y2goL15kYXRhLS8pKVxuICAgICAgICAgICAgLmZpbHRlcihlID0+IHR5cGVvZiAocHJvcHNbZV0pICE9PSAnZnVuY3Rpb24nKTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCB0aGVPcHRpb25zLnZhbHVlUHJvcE5hbWUpKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZVt0aGVPcHRpb25zLnZhbHVlUHJvcE5hbWVdID0gcHJvcHNbdGhlT3B0aW9ucy52YWx1ZVByb3BOYW1lXTtcbiAgICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHByb3BzW3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuaXNNb3VudCA9IHRydWU7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodGhlT3B0aW9ucy51bmNvbnRyb2xsKSB7XG4gICAgICAgICAgc2VsZi5zZXRTdGF0ZSh7IFt0aGVPcHRpb25zLnZhbHVlUHJvcE5hbWVdOiB1bmRlZmluZWQgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZShbdGhlT3B0aW9ucy52YWx1ZVByb3BOYW1lXSwgdGhpcy5wcm9wcywgbmV4dFByb3BzKSkge1xuICAgICAgICAgIGlmICh0aGlzLmxhc3RWYWx1ZSAhPT0gbmV4dFByb3BzW3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVVcGRhdGVEZWJvdW5jZShuZXh0UHJvcHNbdGhlT3B0aW9ucy52YWx1ZVByb3BOYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICBpZiAodGhlT3B0aW9ucy5zaG91bGRDb21wb25lbnRVcGRhdGUpIHtcbiAgICAgICAgICByZXR1cm4gdGhlT3B0aW9ucy5zaG91bGRDb21wb25lbnRVcGRhdGUuY2FsbCh7XG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgIHByb3BzOiB0aGlzLnByb3BzLFxuICAgICAgICAgIH0sIG5leHRQcm9wcywgbmV4dFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gbmV4dFN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZSh0aGlzLnNob3VsZFVwZGF0ZVByb3BzTGlzdCwgdGhpcy5wcm9wcywgbmV4dFByb3BzKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodGhlT3B0aW9ucy51bmNvbnRyb2xsKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5zdGF0ZVt0aGVPcHRpb25zLnZhbHVlUHJvcE5hbWVdKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoeyBbdGhlT3B0aW9ucy52YWx1ZVByb3BOYW1lXTogdW5kZWZpbmVkIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5pc01vdW50ID0gZmFsc2U7XG4gICAgICB9XG5cblxuICAgICAgb25DaGFuZ2UgPSAoKCkgPT4ge1xuICAgICAgICBsZXQgdXBkYiA9IHRoaXMucHJvcHNbdGhlT3B0aW9ucy50cmlnZ2VyXTtcbiAgICAgICAgaWYgKHRoZU9wdGlvbnMudHJpZ2dlck1zID49IDApIHtcbiAgICAgICAgICB1cGRiID0gZGVib3VuY2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzW3RoZU9wdGlvbnMudHJpZ2dlcl0odmFsdWUpO1xuICAgICAgICAgIH0sIHRoZU9wdGlvbnMudHJpZ2dlck1zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXBkYjtcbiAgICAgIH0pKClcblxuICAgICAgaGFuZGxlT25DaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGVPcHRpb25zLmdldFZhbHVlRnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgICAgaWYgKCF0aGVPcHRpb25zLnVuY29udHJvbGwpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgW3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV06IHZhbHVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgdGhlT3B0aW9ucy51bmNvbnRyb2xsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFsdWVVcGRhdGVEZWJvdW5jZSA9ICgoKSA9PiB7XG4gICAgICAgIGlmICh0aGVPcHRpb25zLnZhbHVlUHJvcE1zID49IDApIHtcbiAgICAgICAgICByZXR1cm4gZGVib3VuY2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFt0aGVPcHRpb25zLnZhbHVlUHJvcE5hbWVdOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9LCB0aGVPcHRpb25zLnZhbHVlUHJvcE1zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgW3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV06IHZhbHVlIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkoKVxuXG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHRoZVByb3BzID0ge1xuICAgICAgICAgIC4uLnRoaXMucHJvcHMsXG4gICAgICAgICAgLi4udGhpcy5zdGF0ZSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoZU9wdGlvbnMudW5jb250cm9sbCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgKHRoZVByb3BzW3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGVsZXRlIHRoZVByb3BzW3RoZU9wdGlvbnMudmFsdWVQcm9wTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhlUHJvcHMsIHRoZU9wdGlvbnMudHJpZ2dlcikpIHtcbiAgICAgICAgICB0aGVQcm9wc1t0aGVPcHRpb25zLnRyaWdnZXJdID0gdGhpcy5oYW5kbGVPbkNoYW5nZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoPFJlYWN0RWxlbWVudCB7Li4udGhlUHJvcHN9IC8+KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBSZWFjdEZvcm1GaWVsZERlYm91bmNlLmRlZmF1bHRQcm9wcyA9IFJlYWN0RWxlbWVudC5kZWZhdWx0UHJvcHM7XG4gICAgUmVhY3RGb3JtRmllbGREZWJvdW5jZS5wcm9wVHlwZXMgPSBSZWFjdEVsZW1lbnQucHJvcFR5cGVzO1xuICAgIFJlYWN0Rm9ybUZpZWxkRGVib3VuY2UuZGlzcGxheU5hbWUgPSBgUmVhY3RGb3JtRmllbGREZWJvdW5jZSgke1JlYWN0RWxlbWVudC5uYW1lfSlgO1xuXG4gICAgcmV0dXJuIFJlYWN0Rm9ybUZpZWxkRGVib3VuY2U7XG4gIH07XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCAuLi5hcmdzKSB7XG4gIGxldCByZXN1bHRPcHRpb24gPSB7XG4gICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgZ2V0VmFsdWVGcm9tRXZlbnQ6IChlKSA9PiB7XG4gICAgICBpZiAoIWUgfHwgIWUudGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IGU7XG4gICAgICByZXR1cm4gdGFyZ2V0W3Jlc3VsdE9wdGlvbi52YWx1ZVByb3BOYW1lXTtcbiAgICB9LFxuICB9O1xuICBpZiAodHlwZW9mIChvcHRpb25zKSA9PT0gJ251bWJlcicpIHtcbiAgICByZXN1bHRPcHRpb24gPSB7XG4gICAgICAuLi5yZXN1bHRPcHRpb24sXG4gICAgICB0cmlnZ2VyTXM6IG9wdGlvbnMsXG4gICAgfTtcbiAgICBpZiAodHlwZW9mIChhcmdzWzFdKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXN1bHRPcHRpb24gPSB7XG4gICAgICAgIC4uLnJlc3VsdE9wdGlvbixcbiAgICAgICAgdW5jb250cm9sbDogYXJnc1sxXSxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgKGFyZ3NbMF0pID09PSAnbnVtYmVyJykge1xuICAgICAgcmVzdWx0T3B0aW9uID0ge1xuICAgICAgICAuLi5yZXN1bHRPcHRpb24sXG4gICAgICAgIHZhbHVlUHJvcE1zOiBhcmdzWzBdLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIChvcHRpb25zKSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICByZXN1bHRPcHRpb24gPSB7XG4gICAgICAuLi5yZXN1bHRPcHRpb24sXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVzdWx0T3B0aW9uO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGxpc3QsIHRoaXNQcm9wcywgbmV4dFByb3BzKSA9PiB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSB8fCBsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mICh0aGlzUHJvcHMpICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgKG5leHRQcm9wcykgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBsaXN0LnNvbWUoZSA9PiB0aGlzUHJvcHNbZV0gIT09IG5leHRQcm9wc1tlXSk7XG59O1xuIl19
