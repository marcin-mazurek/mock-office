import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@kadira/storybook';
import AddServerModal from './AddServerModal';
import configureStore from '../store/index';

storiesOf('AddServerModal', module)
  .add('default', () => {
    const store = configureStore();

    return (
      <Provider store={store}>
        <AddServerModal />
      </Provider>
    );
  });
