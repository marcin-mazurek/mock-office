import React from 'react';
import { shallow, mount } from 'enzyme';
import { identity } from 'ramda';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from '../../../../../src/gui/store/index';
import { AddMock, AddMockConnect } from '../../../../../src/gui/mocks/addMock/AddMock';
import { reducers } from '../../../../../src/gui/app/entities/reducer';

describe('AddMock', () => {
  test('default snapshot', () => {
    const props = {
      serverType: 'server type',
      scenario: 'scenario-id',
      params: { id: 'server-id' },
      onSubmit: () => {
      },
      handleSubmit: () => {}
    };
    const wrapper = shallow(<AddMock {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('AddMockConnect', () => {
  it('should be connected to store', () => {
    const store = configureStore();
    let state = store.getState();
    state = state
      .update('entities', entities => reducers.addServer(entities, 'server-id', {
        name: 'Server name',
        port: 3000,
        type: 'http',
        secure: false,
        scenario: 'scenario-id'
      }))
      .update(
        'entities',
        entities => reducers.addScenario(entities, 'server-id', { id: 'scenario-id' })
      );
    const testStore = createStore(identity, state);

    const wrapper = mount(
      <Provider store={testStore}>
        <AddMockConnect params={{ id: 'server-id' }} />
      </Provider>
    );

    expect(wrapper.find(AddMock)).toHaveLength(1);
  });
});
