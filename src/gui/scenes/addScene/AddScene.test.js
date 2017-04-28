import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from '../../store';
import AddSceneConnect, { AddScene } from './AddScene';

describe('AddScene', () => {
  test('default snapshot', () => {
    const props = {
      serverType: 'some type',
      params: { id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==' }
    };
    const wrapper = shallow(<AddScene {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('AddSceneConnect', () => {
  it('should render AddScene', () => {
    const store = configureStore();
    store.dispatch({
      type: 'servers/ADD',
      name: 'Server name',
      port: 3000,
      id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
      serverType: 'http',
      secure: false
    });
    const wrapper = mount(
      <Provider store={store}>
        <AddSceneConnect params={{ id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==' }} />
      </Provider>
    );

    expect(wrapper.find(AddScene)).toHaveLength(1);
  });
});
