import { serversManager } from '../serversManager';

export default function configureGuiEventsMiddleware(guiEventsServer) {
  return function guiEventsMiddleware(req, res, next) {
    const server = serversManager.getServer(req.body.server);
    const scenario = server.getScenario();
    const mock = scenario.mocks.find(mock => mock.id === req.body.mockId);

    mock.on('expire', () => {
      guiEventsServer.broadcast(
        'MOCK_EXPIRE',
        {
          mockId: mock.id,
          scenario: scenario.id
        }
      );
    });

    mock.on('start', () => {
      guiEventsServer.broadcast(
        'MOCK_START',
        {
          mockId: mock.id,
          scenario: scenario.id
        }
      );
    });

    mock.on('end', () => {
      guiEventsServer.broadcast(
        'MOCK_END',
        {
          mockId: mock.id,
          scenario: scenario.id
        }
      );
    });

    mock.on('cancel', () => {
      guiEventsServer.broadcast(
        'MOCK_CANCEL',
        {
          mockId: mock.id,
          scenario: scenario.id
        }
      );
    });

    mock.tasks.forEach((task) => {
      task.on('start', () => {
        guiEventsServer.broadcast(
          'TASK_START',
          {
            mockId: mock.id,
            scenario: scenario.id,
            taskId: task.id
          }
        );
      });

      task.on('end', () => {
        guiEventsServer.broadcast(
          'TASK_END',
          {
            mockId: mock.id,
            scenario: scenario.id,
            taskId: task.id
          }
        );
      });

      task.on('cancel', () => {
        guiEventsServer.broadcast(
          'TASK_CANCEL',
          {
            mockId: mock.id,
            scenario: scenario.id,
            taskId: task.id
          }
        );
      });
    });

    next();
  };
}
