import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@kadira/storybook';
import AddServerModal from '../../src/gui/modals/Modal/AddServerModal';
import configureStore from '../../src/gui/store/index';

storiesOf('AddServerModal', module)
  .add('default', () => {
    const store = configureStore();

    return (
      <Provider store={store}>
        <AddServerModal />
      </Provider>
    );
  });
