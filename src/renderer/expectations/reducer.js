import { Map, Set, List } from 'immutable';
import R from 'ramda';
import { ADD, LOAD, UNLOAD } from './actions';

const initialState = new Map({
  itemsById: new Map(),
  itemsByServer: new Map(),
  loaded: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      return R.invoker(2, 'set')('loaded',
        R.pipe(
          R.invoker(1, 'get')('loaded'),
          R.invoker(1, 'push')(R.pick(['expectationId', 'instanceId', 'quantity'], action))
        )(state),
        state
      );
    }
    case UNLOAD: {
      return R.invoker(2, 'set')('loaded',
        R.pipe(
          R.invoker(1, 'get')('loaded'),
          R.invoker(1, 'filter')(
            expectation => expectation.instanceId !== R.prop('expectationId', action)
          )
        )(state),
        state
      );
    }
    case ADD: {
      const { serverId, expectations } = action;
      let stateRef = state;

      return R.pipe(
        R.invoker(2, 'setIn')(['itemsByServer', serverId],
          R.ifElse(
            R.invoker(1, 'getIn')(['itemsByServer', serverId]),
            R.pipe(
              R.invoker(1, 'getIn')(['itemsByServer', serverId]),
              R.invoker(1, 'concat')(
                R.pipe(
                  R.map(ex => ex.id),
                  R.construct(Set)
                )(expectations)
              )
            ),
            () => R.pipe(
              R.map(ex => ex.id),
              R.construct(Set)
            )(expectations)
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
                R.pipe(
                  R.prop('expectations'),
                  R.reduce(
                    (acc, value) => R.assoc(value.id, value)(acc), {}
                  )
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
