import unique from 'cuid';

export default class Task {
  constructor(mockId, config) {
    this.id = unique();
    this.schedule = config.schedule;
    this.params = config.params || {};
  }
}
