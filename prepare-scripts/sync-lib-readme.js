// Syncs README.md with library.


const fs = require('fs');
const path = require('path');


const PATH_TO_ROOT_README = path.join(__dirname, '..', 'README.md');
const rootReadmeFile = fs.readFileSync(PATH_TO_ROOT_README, 'utf8');

fs.writeFileSync(
  path.join(__dirname, '..', 'projects', 'ngx-lss', 'README.md'),
  rootReadmeFile
);
