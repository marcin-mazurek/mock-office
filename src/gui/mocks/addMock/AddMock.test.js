import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from '../../store';
import AddMockConnect, { AddMock } from './AddMock';
import { add } from '../../entities/servers/actions';
import { add as addScenario } from '../../entities/scenarios/actions';

describe('AddMock', () => {
  test('default snapshot', () => {
    const props = {
      serverType: 'server type',
      scenarioId: 'scenario-id',
      params: { id: 'server-id' }
    };
    const wrapper = shallow(<AddMock {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('AddMockConnect', () => {
  it('should render AddMock', () => {
    const store = configureStore();
    store.dispatch(add(
      'server-id',
      {
        name: 'Server name',
        port: 3000,
        type: 'http',
        secure: false,
        scenario: 'scenario-id'
      }
      )
    );
    store.dispatch(addScenario('server-id', 'scenario-id'));
    const wrapper = mount(
      <Provider store={store}>
        <AddMockConnect params={{ id: 'server-id' }} />
      </Provider>
    );

    expect(wrapper.find(AddMock)).toHaveLength(1);
  });
});
