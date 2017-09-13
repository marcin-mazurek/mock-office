import createSchedule from './createSchedule';

describe('createSchedule', () => {
  it('should create schedule function that be able  to schedule mock part without payload', () => {
    const schedule = createSchedule({});
    expect(
      () => schedule(
        () => {
        },
        () => {
        },
        () => {
        }
      )
    ).not.toThrow();
  });
});
