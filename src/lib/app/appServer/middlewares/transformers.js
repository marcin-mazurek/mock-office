export const reactionToResponse = reaction => ({
  id: reaction.id,
  status: reaction.status,
  params: reaction.params,
  schedule: reaction.schedule,
  type: reaction.type
});

export const behaviourToResponse = behaviour => ({
  id: behaviour.id,
  event: behaviour.event,
  serverId: behaviour.serverId,
  runCounter: behaviour.runCounter,
  loadedCounter: behaviour.loadedCounter,
  status: behaviour.status,
  reactions: behaviour.reactions.map(reactionToResponse)
});

export const serverToResponse = server => ({
  running: server.webServer.isLive(),
  name: server.name,
  type: server.type,
  port: server.webServer.port,
  id: server.id,
  behaviours: server.webServer.codex.behaviours.map(behaviourToResponse),
  fallbackUrl: server.webServer.fallbackUrl,
  recordMode: server.webServer.recordMode
});
