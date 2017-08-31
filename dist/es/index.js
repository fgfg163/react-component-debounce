import _Object$keys from 'babel-runtime/core-js/object/keys';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import debounce from './debounce';
import shouldUpdate from './should-update';
import defaultOptions from './config';

export default (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

  var theOptions = _extends({}, defaultOptions, {
    getValueFromEvent: function getValueFromEvent(e) {
      if (!e || !e.target) {
        return e;
      }
      var target = e.target;

      return target[theOptions.valuePropName];
    }
  });

  if (typeof options === 'number') {
    theOptions = _extends({}, theOptions, {
      triggerMs: options
    });
    if (typeof (arguments.length <= 2 ? undefined : arguments[2]) === 'boolean') {
      theOptions = _extends({}, theOptions, {
        uncontroll: arguments.length <= 2 ? undefined : arguments[2]
      });
    }
    if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'number') {
      theOptions = _extends({}, theOptions, {
        valuePropMs: arguments.length <= 1 ? undefined : arguments[1]
      });
    }
  }

  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && !Array.isArray(options)) {
    theOptions = _extends({}, theOptions, options);
  }

  return function (ReactElement) {
    var ReactFormFieldDebounce = function (_React$Component) {
      _inherits(ReactFormFieldDebounce, _React$Component);

      function ReactFormFieldDebounce(props) {
        _classCallCheck(this, ReactFormFieldDebounce);

        var _this = _possibleConstructorReturn(this, (ReactFormFieldDebounce.__proto__ || _Object$getPrototypeOf(ReactFormFieldDebounce)).call(this, props));

        _this.onChange = function () {
          var updb = _this.props[theOptions.trigger];
          if (theOptions.triggerMs >= 0) {
            updb = debounce(function (value) {
              _this.props[theOptions.trigger](value);
            }, theOptions.triggerMs);
          }
          return updb;
        }();

        _this.handleOnChange = function (event) {
          var value = theOptions.getValueFromEvent(event);
          if (!theOptions.uncontroll) {
            _this.setState(_defineProperty({}, theOptions.valuePropName, value));
          }
          _this.lastValue = value;
          _this.onChange(value);
          if (event && event.target) {
            theOptions.uncontroll = false;
          }
        };

        _this.valueUpdateDebounce = function () {
          if (theOptions.valuePropMs >= 0) {
            return debounce(function (value) {
              _this.lastValue = value;
              _this.setState(_defineProperty({}, theOptions.valuePropName, value));
            }, theOptions.valuePropMs);
          }
          return function (value) {
            _this.lastValue = value;
            _this.setState(_defineProperty({}, theOptions.valuePropName, value));
          };
        }();

        _this.isMount = false;
        _this.lastValue = '';
        _this.shouldUpdatePropsList = function () {
          var thePropsList = _Object$keys(ReactElement.propTypes || {});
          if (thePropsList.length === 0) {
            thePropsList = _Object$keys(props || {});
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

      _createClass(ReactFormFieldDebounce, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.isMount = true;
          var self = this;
          if (theOptions.uncontroll) {
            self.setState(_defineProperty({}, theOptions.valuePropName, undefined));
          }
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (shouldUpdate([theOptions.valuePropName], this.props, nextProps)) {
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
          if (shouldUpdate(this.shouldUpdatePropsList, this.props, nextProps)) {
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
              self.setState(_defineProperty({}, theOptions.valuePropName, undefined));
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
          var theProps = _extends({}, this.props, this.state);
          if (theOptions.uncontroll) {
            if (typeof theProps[theOptions.valuePropName] === 'undefined') {
              delete theProps[theOptions.valuePropName];
            }
          }
          if (Object.prototype.hasOwnProperty.call(theProps, theOptions.trigger)) {
            theProps[theOptions.trigger] = this.handleOnChange;
          }

          return React.createElement(ReactElement, theProps);
        }
      }]);

      return ReactFormFieldDebounce;
    }(React.Component);

    ReactFormFieldDebounce.defaultProps = ReactElement.defaultProps;
    ReactFormFieldDebounce.propTypes = ReactElement.propTypes;
    ReactFormFieldDebounce.displayName = 'ReactFormFieldDebounce(' + ReactElement.name + ')';

    return ReactFormFieldDebounce;
  };
});