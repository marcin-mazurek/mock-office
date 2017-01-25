export default (proxiedFn) => {
  // eslint-disable-next-line no-param-reassign
  proxiedFn.toString = Object.prototype.toString;
  return proxiedFn;
};
