import { render } from 'react-dom';
import startAppSync from './appSync/startAppSync';
import configureStore from './store';
import routes from './routes';
import configureApp from './app';

const store = configureStore();
const App = configureApp(store, routes);

startAppSync(store);

render(App, document.querySelector('.js-main'));
