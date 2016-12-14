const fs = require('fs');

export default (path) => JSON.parse(fs.readFileSync(path));
