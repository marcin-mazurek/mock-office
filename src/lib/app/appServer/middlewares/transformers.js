export const taskToResponse = task => ({
  id: task.id,
  status: task.status,
  params: task.params,
  schedule: task.scheduleParams
});

export const mockToResponse = mock => ({
  id: mock.id,
  runCounter: mock.runCounter,
  loadedCounter: mock.loadedCounter,
  status: mock.status,
  tasks: mock.tasks.map(taskToResponse)
});
