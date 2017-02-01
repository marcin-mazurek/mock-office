import prepareForCall from './redux-saga';

test('prepareForCall should prepare method to be used by redux-saga call task', () => {
  const someFn = () => {};
  const proxiedFn = new Proxy(someFn, {});

  expect(proxiedFn.toString).toThrow();
  expect(prepareForCall(proxiedFn)).not.toThrow();
});
