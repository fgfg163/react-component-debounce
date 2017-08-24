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