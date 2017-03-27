import { render } from 'react-dom';
import syncScenes from './scenes/syncScenes';
import syncState from './app/syncState';
import configureStore from './store';
import routes from './routes';
import configureApp from './app';

const store = configureStore();
const App = configureApp(store, routes);

syncScenes(store);
syncState(store);

render(App, document.querySelector('.js-main'));
