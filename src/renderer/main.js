import React from 'react';
import { render } from 'react-dom';
import { remote } from 'electron';
import App from './app/App';
import syncTasks from './tasks/syncTasks';
import syncServers from './app/syncServers';
import store from './store';

syncTasks();
syncServers(remote, store);

render(<App />, document.querySelector('.js-main'));
