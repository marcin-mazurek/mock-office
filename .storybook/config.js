import { configure } from '@kadira/storybook';
import '../src/doubles/gui/styles/main.scss';

function loadStories() {
  require('../src/doubles/gui/.storybook/stories');
}

configure(loadStories, module);
