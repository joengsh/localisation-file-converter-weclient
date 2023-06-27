import {writeFile} from "fs/promises";
import {cn} from './localisation/cn';
import {en} from './localisation/en';
import {zh} from './localisation/zh';
import {id} from './localisation/id';
import {th} from './localisation/th';
import {vi} from './localisation/vi';

const map = {en,cn,zh,id,th,vi};

var data = Object.keys(map).reduce((result,val)=>{return result+','+val},'key');
data += '\n';

writeObj(en);
writeToFile();


async function writeToFile() {
  await writeFile('./output.csv',data);
}

function writeObj(obj,keys=[]) {
  for (const key in obj ) {
    if (typeof obj[key] === 'object') {
      writeObj(obj[key],[...keys, key]);
    } else {
      // write line
      writeLine([...keys, key]);
    }
  }
}

function writeLine(keys) {
  data += getKeyName(keys);
  for (const obj of Object.values(map)) {
    try {
      data += ','+getValue(obj,keys);
    } catch(err) {}
  }
  data += '\n';
}

function getKeyName(keys) {
  return keys.reduce((str,val)=>{return (str?(str+'.'):'')+val},'')
}

function getValue(obj, keys) {
  if (keys.length==0) return '';
  else {
    let o = obj;
    for (const key of keys) {
      o = o[key];
    }
    return `"${String(o).replace(/\n/g, '\\n').replace(/\"/g, '\'')}"`;
  }
}