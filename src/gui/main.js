import { render } from 'react-dom';
import startAppSync from './appSync/startAppSync';
import configureStore from './app/configureStore';
import configureRoutes from './app/router/configureRoutes';
import configureApp from './app/configureApp';
import connectEventsServer from './resources/eventsServer';

const store = configureStore();
const routes = configureRoutes(store);
const App = configureApp(store, routes);

startAppSync(connectEventsServer(), store);

render(App, document.querySelector('.js-main'));
