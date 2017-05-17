import requestAddServer from './rest';
import { ConnectionError } from '../../errors/types';

describe('requestAddServer', () => {
  it('should returns data on status 200 from API', (done) => {
    fetch.mockResponse(JSON.stringify({}), {
      status: 200
    });

    requestAddServer({}).then(
      (result) => {
        expect(result).toHaveProperty('data');
        done();
      }
    );
  });

  it('should returns error on status 400 from API', (done) => {
    fetch.mockResponse(JSON.stringify({
      error: 'error message'
    }), {
      status: 400
    });

    requestAddServer({}).then(
      (result) => {
        expect(result).toHaveProperty('error');
        done();
      }
    );
  });
  it('should returns error on connection error', (done) => {
    const connectionError = new ConnectionError();
    const originalFetch = global.fetch;
    global.fetch = () => Promise.reject(connectionError);

    requestAddServer({}).then(
      (result) => {
        expect(result.error).toEqual(connectionError.message);
        global.fetch = originalFetch;
        done();
      }
    );
  });
});
