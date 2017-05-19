import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import EditServerPage, { EditServerFormConnect, EditServerForm } from './EditServer';
import configureStore from '../../store';
import { add } from '../../entities/servers/actions';

describe('EditServerPage', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<EditServerPage params={{ id: 'id' }} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('EditServerForm', () => {
  test('default snapshot', () => {
    const wrapper = shallow(<EditServerForm handleSubmit={() => {
    }} serverId={'id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('EditServerFormConnect', () => {
  it('should be connected to store', () => {
    const store = configureStore();
    store.dispatch(add('id', {
      name: 'name',
      port: 3000,
      type: 'http'
    }));
    const wrapper = mount(
      <Provider store={store}>
        <EditServerFormConnect serverId="id" />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
