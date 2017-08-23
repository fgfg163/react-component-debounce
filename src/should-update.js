export default (list, thisProps, nextProps) => {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  if (typeof (thisProps) !== 'object' || typeof (nextProps) !== 'object') {
    return false;
  }
  return list.some(e => thisProps[e] !== nextProps[e]);
};
