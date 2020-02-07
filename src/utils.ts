import * as fs from 'fs';

export function readFile(path) {
  return fs.readFileSync(path).toString();
}

export const readXML = readFile;
