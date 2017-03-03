import { send } from './HttpServer';

describe('HttpServer', () => {
  test('send should send headers provide by user', () => {
    const mockFn = jest.fn();
    const taskWithHeaders = {
      headers: {
        'header name': 'header value'
      }
    };
    const taskWithoutHeaders = {};
    const req = {};
    const res = {
      set(headers) {
        this.headers = headers;
      },
      headers: {},
      json() {
        mockFn(this.headers);
      }
    };

    send(Object.create(req), Object.create(res))(taskWithHeaders);
    expect(mockFn.mock.calls[0][0]).toEqual({
      'header name': 'header value'
    });

    send(Object.create(req), Object.create(res))(taskWithoutHeaders);
    expect(mockFn.mock.calls[1][0]).toEqual({});
  });
});
