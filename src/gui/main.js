import { render } from 'react-dom';
import startAppSync from './appSync/startAppSync';
import configureStore from './store';
import configureRoutes from './routing/routes';
import configureApp from './app';
import connectEventsServer from './resources/eventsServer';

const store = configureStore();
const routes = configureRoutes(store);
const App = configureApp(store, routes);

startAppSync(connectEventsServer(), store);

render(App, document.querySelector('.js-main'));
