import requestEditServer from './rest';

describe('requestEditServer', () => {
  it('should returns payload if response status is 200', (done) => {
    fetch.mockResponseOnce(
      JSON.stringify({
        id: 'id'
      }),
      {
        status: 200
      });

    requestEditServer('id', {}).then((res) => {
      expect(res).toEqual(
        {
          data: {
            id: 'id'
          }
        }
      );
      done();
    });
  });

  it('should returns error if response status is 404', (done) => {
    fetch.mockResponseOnce(
      JSON.stringify({
        error: 'response error'
      }),
      {
        status: 400
      });

    requestEditServer('id', {})
      .then((res) => {
        expect(res).toEqual(
          {
            error: 'response error'
          }
        );
      })
      .then(() => {
        fetch.mockResponseOnce(
          JSON.stringify({
            error: 'response error'
          }),
          {
            status: 404
          });

        return requestEditServer('id', {});
      })
      .then((res) => {
        expect(res).toEqual(
          {
            error: 'response error'
          }
        );
        done();
      });
  });

  it('should returns error on unsupported response status', (done) => {
    fetch.mockResponseOnce(
      '',
      {
        status: 999
      });

    requestEditServer('id', {})
      .then((res) => {
        expect(res).toHaveProperty('error');
        done();
      });
  });
});
