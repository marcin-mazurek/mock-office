// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import App from './App';
import React from 'react';
import { render } from 'react-dom';

render(<App />, document.querySelector('.js-main'));

