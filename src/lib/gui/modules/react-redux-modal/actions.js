export const OVERLAY_CLICKED = 'modal/OVERLAY_CLICKED';
export const OPEN = 'modal/OPEN';
export const CLOSE = 'modal/CLOSE';
export const overlayClickedAction = () => ({
  type: OVERLAY_CLICKED
});
export const openAction = (component, params) => ({
  type: OPEN,
  component,
  params
});
export const closeAction = () => ({
  type: CLOSE
});
