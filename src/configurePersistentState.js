import fs from 'fs';

const PATH_TO_FILE = './mockeeState.json';

export default function configurePersistentState(serversManager) {
  function save() {
    fs.writeFileSync(PATH_TO_FILE, JSON.stringify(serversManager.getState()), 'utf8');
  }

  function restore() {
    fs.readFile(PATH_TO_FILE, (err, data) => {
      if (err) return;

      try {
        const persistentState = JSON.parse(data);
        serversManager.setState(persistentState);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    });
  }

  return {
    save,
    restore
  };
}
