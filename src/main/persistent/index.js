import uniqueId from 'node-unique';
import fs from 'fs';

export default path => JSON.parse(fs.readFileSync(path))
  .map((mockFromFile) => {
    const mock = mockFromFile;
    mock.id = uniqueId();
    return mock;
  });
