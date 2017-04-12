import { render } from 'react-dom';
import syncScenes from './app/syncScenes';
import configureStore from './store';
import routes from './routes';
import configureApp from './app';

const store = configureStore();
const App = configureApp(store, routes);

syncScenes(store);

render(App, document.querySelector('.js-main'));
