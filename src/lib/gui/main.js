import { render } from 'react-dom';
import startAppSync from './appSync';
import configureStore from './app/configureStore';
import configureRoutes from './app/routing/configureRoutes';
import configureApp from './app/configureApp';
import connectEventsServer from './resources/eventsServer';
import { startAction } from './actions';

const store = configureStore();
store.dispatch(startAction());
const routes = configureRoutes(store);
const App = configureApp(store, routes);

startAppSync(connectEventsServer(), store);

render(App, document.querySelector('.js-main'));
