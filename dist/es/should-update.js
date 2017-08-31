import _typeof from 'babel-runtime/helpers/typeof';
export default (function (list, thisProps, nextProps) {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  if ((typeof thisProps === 'undefined' ? 'undefined' : _typeof(thisProps)) !== 'object' || (typeof nextProps === 'undefined' ? 'undefined' : _typeof(nextProps)) !== 'object') {
    return false;
  }
  return list.some(function (e) {
    return thisProps[e] !== nextProps[e];
  });
});