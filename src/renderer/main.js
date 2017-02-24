import React from 'react';
import { render } from 'react-dom';
import { remote } from 'electron';
import App from './app/App';
import syncTasks from './tasks/syncTasks';
import syncState from './app/syncState';
import store from './store';

syncTasks(store);
syncState(remote, store);

render(<App />, document.querySelector('.js-main'));
