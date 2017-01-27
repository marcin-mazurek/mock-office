import { Map, Set, List } from 'immutable';
import R from 'ramda';
import { ADD } from './actions';
import createExpectation from './model';

const initialState = new Map({
  itemsById: new Map(),
  itemsByServer: new Map(),
  loaded: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { serverId, expectations } = action;
      let stateRef = state;
      let expectationsCache = R.construct(List)();

      return R.pipe(
        R.invoker(2, 'setIn')(['itemsByServer', serverId],
          R.pipe(
            R.tap(
              () => {
                expectationsCache = R.pipe(
                  R.map(createExpectation),
                  R.filter(R.pipe(R.isNil, R.not)),
                )(expectations);
              }
            ),
            R.ifElse(
              R.invoker(1, 'getIn')(['itemsByServer', serverId]),
              R.pipe(
                R.invoker(1, 'getIn')(['itemsByServer', serverId]),
                R.invoker(1, 'concat')(
                  R.pipe(
                    R.map(R.prop('id')),
                    R.construct(Set)
                  )(expectationsCache)
                )
              ),
              () => R.pipe(
                R.map(R.prop('id')),
                R.construct(Set)
              )(expectationsCache)
            )
          )(stateRef)
        ),
        R.tap((st) => {
          stateRef = st;
        }),
        R.invoker(2, 'set')('itemsById',
          R.pipe(
            R.invoker(1, 'get')('itemsById'),
            R.invoker(1, 'merge')(
              R.pipe(
                R.prop('expectations'),
                R.reduce(
                  (acc, value) => R.assoc(value.id, createExpectation(value))(acc), {}
                )
              )(action)
            )
          )(stateRef)
        )
      )(stateRef);
    }
    default: {
      return state;
    }
  }
};
