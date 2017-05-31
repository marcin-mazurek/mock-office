import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from '../../../../src/gui/store/index';
import AddMockConnect, { AddMock } from '../../../../src/gui/mocks/addMock/AddMock';
import { actionCreators } from '../../../../src/gui/entities/module';

describe('AddMock', () => {
  test('default snapshot', () => {
    const props = {
      serverType: 'server type',
      scenario: 'scenario-id',
      params: { id: 'server-id' },
      onSubmit: () => {}
    };
    const wrapper = shallow(<AddMock {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('AddMockConnect', () => {
  it('should render AddMock', () => {
    const store = configureStore();
    store.dispatch(actionCreators.addServerAction(
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
    store.dispatch(actionCreators.addScenarioAction('server-id', 'scenario-id'));
    const wrapper = mount(
      <Provider store={store}>
        <AddMockConnect params={{ id: 'server-id' }} />
      </Provider>
    );

    expect(wrapper.find(AddMock)).toHaveLength(1);
  });
});
