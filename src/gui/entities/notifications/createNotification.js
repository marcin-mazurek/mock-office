import { Record } from 'immutable';
import unique from 'cuid';

export const Notification = new Record({
  id: '',
  text: '',
  type: 'info'
});

// createNotification :: Object -> Notification
export default function createNotification(params) {
  const config = {};

  config.id = unique();
  if (params.type === 'info' || params.type === 'error') {
    config.type = params.type;
  }
  config.text = params.text;

  return new Notification(config);
}
