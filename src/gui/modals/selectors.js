import modalsReduxModule from './modalsReduxModule';

export default modalsReduxModule.createSelectors(state => state.get('modals'));
