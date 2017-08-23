export default function (func, ms) {
  let tid;
  return (...args) => {
    if (tid) {
      clearTimeout(tid);
    }
    tid = setTimeout(() => {
      func(...args);
    }, ms);
  };
};
