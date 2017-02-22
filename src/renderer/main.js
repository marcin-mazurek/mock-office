import React from 'react';
import { render } from 'react-dom';
import { remote } from 'electron';
import App from './app/App';
import removeTaskAfterUse from './tasks/removeTaskAfterUse';
import syncServers from './app/syncServers';
import store from './store';

removeTaskAfterUse(store);
syncServers(remote, store);

render(<App />, document.querySelector('.js-main'));
