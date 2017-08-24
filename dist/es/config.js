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