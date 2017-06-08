import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Provider } from 'react-redux';
import { Modal } from '../../src/gui/modals/Modal/Modal';
import configureStore from '../../src/gui/store/index';

storiesOf('Modal', module)
  .add('addServerModal', () => {
    const store = configureStore();

    return (
      <Provider store={store}>
        <Modal component="addServerModal" onOverlayClick={() => {}} />
      </Provider>
    );
  });
