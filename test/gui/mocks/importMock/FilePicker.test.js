import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FilePicker } from '../../../../src/gui/mocks/importMock/FilePicker';

describe('FilePicker', () => {
  test('default snapshot', () => {
    const props = {
      init: () => {},
      server: 'server',
      scenario: 'scenario',
      onFileChange: () => {}
    };

    const wrapper = shallow(<FilePicker {...props} serverId={'server id'} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should dispatch mock if file has been selected', () => {
    const mockedOnFileChange = jest.fn();

    const props = {
      onFileChange: mockedOnFileChange,
      server: 'server',
      scenario: 'scenario'
    };

    const wrapper = mount(<FilePicker {...props} serverId={'server id'} />);
    const fileInput = wrapper.find('input');

    fileInput.simulate('change', {
      target: {
        files: []
      }
    });

    expect(mockedOnFileChange.mock.calls.length).toEqual(0);

    fileInput.simulate('change', {
      target: {
        files: [
          'some-file'
        ]
      }
    });

    expect(mockedOnFileChange.mock.calls.length).toEqual(1);
  });

  it('should clean input value after file pick', () => {
    const props = {
      init: () => {},
      server: 'server',
      scenario: 'scenario',
      onFileChange: () => {}
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
