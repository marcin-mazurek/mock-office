import Scenario from './Scenario';

export default class Player {
  constructor(eventBus) {
    this.scenario = new Scenario();
    this.eventBus = eventBus;
  }

  add(type, cfg) {
    switch (type) {
      case 'mock': {
        const mock = this.scenario.addMock(cfg);

        if (this.eventBus) {
          mock.on(
            'start',
            () => this.eventBus.emit('mock-start', { mockId: mock.id, scenarioId: this.scenario.id })
          );
          mock.on(
            'end',
            () => this.eventBus.emit('mock-end', { mockId: mock.id, scenarioId: this.scenario.id })
          );
          mock.on(
            'cancel',
            () => this.eventBus.emit('mock-cancel', { mockId: mock.id, scenarioId: this.scenario.id })
          );
          mock.on(
            'expire',
            () => this.eventBus.emit('mock-expire', { mockId: mock.id, scenarioId: this.scenario.id })
          );
          mock.tasks.forEach((task) => {
            task.on(
              'start',
              () => this.eventBus.emit('task-start', { taskId: task.id, mockId: mock.id })
            );
            task.on(
              'end',
              () => this.eventBus.emit('task-end', { taskId: task.id, mockId: mock.id })
            );
            task.on(
              'cancel',
              () => this.eventBus.emit('task-cancel', { taskId: task.id, mockId: mock.id })
            );
          });
        }

        return mock;
      }
      default: {
        return null;
      }
    }
  }

  play(requirements) {
    return this.scenario.play(requirements);
  }

  get(entity, params) {
    switch (entity) {
      case 'scenario': {
        return this.scenario;
      }
      case 'mock': {
        const scenario = this.scenario;
        if (scenario) {
          return scenario.getMock(params.mockId);
        }

        return null;
      }
      default: {
        return null;
      }
    }
  }

  remove(entity, params) {
    switch (entity) {
      case 'mock': {
        return this.scenario.removeMock(params.mockId);
      }
      default: {
        return false;
      }
    }
  }
}
