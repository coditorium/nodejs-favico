const mkdirp = require('mkdirp');
const copyDir = require('copy-dir');
const crypto = require('crypto');
const fs = require('fs');

const stringify = obj =>
  JSON.stringify(obj, null, 2);

const toPromise = callback =>
  new Promise((resolve, reject) => {
    callback((err, value) => (err ?
      reject(err) :
      resolve(value)
    ));
  });

exports.toPromise = toPromise;

exports.ensureDirector = dirPath =>
  toPromise(cb => mkdirp(dirPath, cb));

exports.dirExists = dirPath =>
  toPromise(cb => fs.stat(dirPath, cb))
    .then(stats => stats.isDirectory() && dirPath)
    .catch(() => false);

exports.copyDir = (from, to) =>
  toPromise(cb => copyDir(from, to, cb));

exports.readFile = filePath =>
  toPromise(cb => fs.readFile(filePath, 'utf8', cb));

exports.writeFile = (content, filePath) =>
  toPromise(cb => fs.writeFile(filePath, content, cb));

exports.writeJsonFile = (object, filePath) =>
  toPromise(cb => fs.writeFile(filePath, stringify(object), cb));

exports.readJson = filePath =>
  toPromise(cb => fs.readFile(filePath, 'utf8', cb))
    .then(content => JSON.parse(content));

exports.hashFile = filePath =>
  new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const hash = crypto
      .createHash('sha1')
      .setEncoding('hex');
    stream
      .on('error', reject)
      .on('end', () => {
        hash.end();
        resolve(hash.read());
      })
      .pipe(hash);
  });
