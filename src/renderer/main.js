import { render } from 'react-dom';
import syncTasks from './tasks/syncTasks';
import syncState from './app/syncState';
import configureStore from './store';
import routes from './routes';
import configureApp from './app';

const store = configureStore();
const App = configureApp(store, routes);

syncTasks(store);
syncState(store);

render(App, document.querySelector('.js-main'));
