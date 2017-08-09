import { configure } from '@kadira/storybook';
import '../src/gui/styles/main.scss';

function loadStories() {
  require('../storybookStories');
}

configure(loadStories, module);
