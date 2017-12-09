import unique from 'cuid';

export default (params) => {
  const notification = {};

  notification.id = unique();
  switch (params.type) {
    case 'error': {
      notification.type = 'error';
      break;
    }
    case 'success': {
      notification.type = 'success';
      break;
    }
    default: {
      notification.type = 'info';
    }
  }
  notification.text = params.text;

  return notification;
};
