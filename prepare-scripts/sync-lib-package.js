// Syncs the root `package.json` with library `package.json`.

const fs = require('fs');
const path = require('path');

const FIELDS_TO_SYNC = [
  'name',
  'version',
  'description',
  'keywords',
  'author',
  'license',
  'repository',
];
const PATH_TO_ROOT_JSON = path.join('..', 'package.json');
const PATH_TO_LIBRARY_JSON = path.join('..', 'projects', 'ngx-lss', 'package.json');


const rootJsonFile = require(PATH_TO_ROOT_JSON);
const libraryJsonFile = require(PATH_TO_LIBRARY_JSON);

FIELDS_TO_SYNC.forEach(field => {
  libraryJsonFile[field] = rootJsonFile[field];
});

fs.writeFileSync(
  path.join(__dirname, PATH_TO_LIBRARY_JSON),
  JSON.stringify(libraryJsonFile, null, 2)
);
