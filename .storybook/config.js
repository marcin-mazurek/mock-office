import { configure } from '@kadira/storybook';
import '../src/gui/styles/main.scss';

function loadStories() {
  require('../src/gui/.storybook/stories');
}

configure(loadStories, module);
