import { Record } from 'immutable';
import unique from 'cuid';

export const Notification = new Record({
  id: '',
  text: '',
  type: 'info'
});

export const createNotification = (params) => {
  const config = {};

  config.id = unique();
  switch (params.type) {
    case 'error': {
      config.type = 'error';
      break;
    }
    case 'success': {
      config.type = 'success';
      break;
    }
    default: {
      config.type = 'info';
    }
  }
  config.text = params.text;

  return new Notification(config);
};
