export const reactionToResponse = reaction => ({
  id: reaction.id,
  status: reaction.status,
  params: reaction.params,
  schedule: reaction.scheduleParams
});

export const behaviourToResponse = behaviour => ({
  id: behaviour.id,
  serverId: behaviour.serverId,
  runCounter: behaviour.runCounter,
  loadedCounter: behaviour.loadedCounter,
  status: behaviour.status,
  tasks: behaviour.reactions.map(reactionToResponse)
});

export const serverToResponse = server => ({
  running: server.webServer.isLive(),
  name: server.name,
  type: server.type,
  port: server.webServer.port,
  id: server.id,
  behaviours: server.webServer.codex.behaviours.map(behaviourToResponse)
});
