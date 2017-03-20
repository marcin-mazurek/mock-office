import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Server, ServerPlaceholder, ServerInspect } from './Server';

describe('ServerPlaceholder', () => {
  test('some servers exist snapshot', () => {
    const wrapper = shallow(<ServerPlaceholder serverExists />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('any servers exists snapshot', () => {
    const wrapper = shallow(<ServerPlaceholder serverExists={false} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('Server', () => {
  test('default snapshot', () => {
    const props = {
      selected: 'id',
      running: true,
      serverDetails: {
        name: 'some id',
        type: 'some type',
        port: 3000,
        queue: 'some queue id',
        id: 'some id'
      }
    };
    const wrapper = shallow(<Server {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('ServerInspect', () => {
  test('default snapshot', () => {
    const props = {
      running: true,
      serverDetails: {
        name: 'some id',
        type: 'some type',
        port: 3000,
        queue: 'some queue id',
        id: 'some id'
      }
    };
    const wrapper = shallow(<ServerInspect {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
