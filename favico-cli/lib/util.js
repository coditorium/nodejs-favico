const fs = require('fs');

const toPromise = callback =>
  new Promise((resolve, reject) => {
    callback((err, value) => (err ?
      reject(err) :
      resolve(value)
    ));
  });

exports.readJson = filePath =>
  toPromise(cb => fs.readFile(filePath, 'utf8', cb))
    .then(content => JSON.parse(content));
