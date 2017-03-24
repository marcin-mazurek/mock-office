import { render } from 'react-dom';
import syncDescriptions from './descriptions/syncDescriptions';
import syncState from './app/syncState';
import configureStore from './store';
import routes from './routes';
import configureApp from './app';

const store = configureStore();
const App = configureApp(store, routes);

syncDescriptions(store);
syncState(store);

render(App, document.querySelector('.js-main'));
