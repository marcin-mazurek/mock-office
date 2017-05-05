import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FilePicker } from './FilePicker';

describe('FilePicker', () => {
  test('default snapshot', () => {
    const props = {
      init: () => {}
    };

    const wrapper = shallow(<FilePicker {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should dispatch mock if file has been selected', () => {
    const mockedHandleChange = jest.fn();

    const props = {
      init: mockedHandleChange
    };

    const wrapper = mount(<FilePicker {...props} serverId={'server id'} />);
    const fileInput = wrapper.find('input');

    fileInput.simulate('change', {
      target: {
        files: []
      }
    });

    expect(mockedHandleChange.mock.calls.length).toEqual(0);

    fileInput.simulate('change', {
      target: {
        files: [
          'some-file'
        ]
      }
    });

    expect(mockedHandleChange.mock.calls.length).toEqual(1);
  });

  it('should clean input value after file pick', () => {
    const props = {
      init: () => {}
    };
    const wrapper = mount(<FilePicker {...props} serverId={'server id'} />);
    const fileInput = wrapper.find('input');

    fileInput.simulate('change', {
      target: {
        files: [
          {
            name: 'some-file'
          }
        ],
        value: 'filename.ext'
      }
    });

    expect(fileInput.getDOMNode().value).toEqual('');
  });
});
