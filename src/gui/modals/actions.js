export const OPEN = 'modals/OPEN';
export const CLOSE = 'modals/CLOSE';

export const openAction = component => ({
  type: OPEN,
  component
});

export const closeAction = () => ({
  type: CLOSE
});
