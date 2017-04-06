import fs from 'fs';
import serversHub from './double/servers';

const PATH_TO_FILE = './mockeeState.json';

export function save() {
  const state = serversHub.servers.map(
    server => ({
      name: server.name,
      type: server.type,
      scenes: server.getScenario().scenes.map(scene => ({
        title: scene.title,
        requirements: scene.requirements,
        reuse: scene.reuse,
        parts: scene.parts.map(scenePart => ({
          title: scenePart.scheduleDetails.title,
          type: scenePart.scheduleDetails.type,
          payload: scenePart.scheduleDetails.payload,
          delay: scenePart.scheduleDetails.delay
        }))
      }))
    })
  );

  fs.writeFileSync(PATH_TO_FILE, JSON.stringify(state), 'utf8');
}

export function restore() {
  fs.readFile(PATH_TO_FILE, (err, data) => {
    if (err) return;

    try {
      const serverState = JSON.parse(data);

      serverState.forEach((s) => {
        const id = serversHub.add(s.name, s.port, s.type, s.isSecure, s.keyPath, s.certPath, false);
        const server = serversHub.find(id);
        s.scenes.forEach((scene) => {
          server.getScenario().addScene(scene);
        });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  });
}
