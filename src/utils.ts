import * as fs from 'fs';

export function readXML(path) {
  const xmlString = fs.readFileSync(path).toString();
  return xmlString;
}
