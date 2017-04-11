import commandLineArgs from 'command-line-args';
import './serve-app';

const options = commandLineArgs([
  {
    name: 'gui',
    type: Boolean
  }
]);

if (options.gui) {
  // eslint-disable-next-line global-require
  require('./serve-gui');
}
