const fs = require('fs');
const del = require('del');

const toPromise = callback =>
  new Promise((resolve, reject) => {
    callback((err, value) => {
      if (err) return reject(err);
      return resolve(value);
    });
  });

exports.fileExists = (...paths) =>
  Promise.all(
    paths.map(p =>
      toPromise(cb => fs.stat(p, cb))
        .then(stats => stats.isFile() && p)
        .catch(() => false)
    )
  )
  .then(resolved => paths.every(p => resolved.includes(p)));

exports.getModifiedTime = filePath =>
  toPromise(cb => fs.stat(filePath, cb))
    .then(stats => stats.ctime.getTime());

exports.readFile = filePath =>
  toPromise(cb => fs.readFile(filePath, 'utf8', cb));

exports.readJson = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) =>
      (err ? reject(err) : resolve(JSON.parse(content))));
  });

exports.delete = (...paths) =>
  del(paths);

exports.dirExists = (...paths) =>
  Promise.all(
    paths.map(p =>
      toPromise(cb => fs.stat(p, cb))
        .then(stats => stats.isDirectory() && p)
        .catch(() => false)
    )
  )
  .then(resolved => paths.every(p => resolved.includes(p)));
