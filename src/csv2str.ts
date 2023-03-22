import {readFile, writeFile} from "fs/promises";
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const results = [];

console.log(process.argv);
var map = {};

async function readCSVFile() {
  return new Promise( resolve => {
    const filename = process.argv[2];
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      Object.keys(results[0]).forEach(key => {
        if (key != 'key') {
          map[key] = {}
        }
      });
      for (const item of results) {
        for (const key of Object.keys(item)) {
          if (key == 'key' || !item[key] || item[key]=='undefined') continue;
          setObjectValue(map[key], item['key'].split('.'), item[key]);
        }
      }
      resolve(map);
      // console.log(map['en']);
      // [
      //   { NAME: 'Daffy Duck', AGE: '24' },
      //   { NAME: 'Bugs Bunny', AGE: '22' }
      // ]
    });
  });
}

function setObjectValue(obj, keys, value) {
  let o = obj;
  try {
    for (var i=0;i<keys.length-1;i++) {
      if (!o[keys[i]]) {
        o[keys[i]] = {};
      }
      o = o[keys[i]];
    }
    if (!value || value !== 'undefined') o[keys[i]] = value;
  } catch(err) {
    console.error(err, obj, keys, value);
  }
}

async function writeToFiles() {
  var dirname = path.dirname('outputs');
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  
  for (const key of Object.keys(map)) {
    let str = JSON.stringify(map[key]).replace(/\\\\n/g, '\\n').replace(/"([^"]+)":/g, '$1:');;
    await writeFile('./outputs/'+key+'.txt', str);
  }
}

async function action() {
  await readCSVFile();
  await writeToFiles();
}

action();
