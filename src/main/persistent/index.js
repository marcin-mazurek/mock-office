import uniqueId from 'node-unique';

const fs = require('fs');

export default path => JSON.parse(fs.readFileSync(path))
  .map((mockFromFile) => {
    const mock = mockFromFile;
    mock.id = uniqueId();
    return mock;
  });
