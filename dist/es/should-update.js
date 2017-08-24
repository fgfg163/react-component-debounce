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