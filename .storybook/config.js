import { configure } from '@kadira/storybook';
import '../src/gui/styles/main.scss';

function loadStories() {
  require('./stories');
}

configure(loadStories, module);
