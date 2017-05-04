import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddSceneForm } from '../../../../../src/gui/scenes/addScene/httpServerForm/AddSceneForm';

describe('HttpForm', () => {
  test('default snapshot', () => {
    const props = {
      initAddScene: () => {},
      queueId: 'some id'
    };
    const wrapper = shallow(<AddSceneForm {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
