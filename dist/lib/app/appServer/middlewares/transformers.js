"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var reactionToResponse = exports.reactionToResponse = function reactionToResponse(reaction) {
  return {
    id: reaction.id,
    status: reaction.status,
    params: reaction.params,
    schedule: reaction.schedule,
    type: reaction.type
  };
};

var behaviourToResponse = exports.behaviourToResponse = function behaviourToResponse(behaviour) {
  return {
    id: behaviour.id,
    event: behaviour.event,
    serverId: behaviour.serverId,
    runCounter: behaviour.runCounter,
    loadedCounter: behaviour.loadedCounter,
    status: behaviour.status,
    reactions: behaviour.reactions.map(reactionToResponse)
  };
};

var serverToResponse = exports.serverToResponse = function serverToResponse(server) {
  return {
    running: server.webServer.isLive(),
    name: server.name,
    type: server.type,
    port: server.webServer.port,
    id: server.id,
    behaviours: server.webServer.codex.behaviours.map(behaviourToResponse)
  };
};
//# sourceMappingURL=transformers.js.map