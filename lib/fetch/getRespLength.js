var Promise = require('bluebird')

function getRespLength(stream) {
  return new Promise(function (resolve, reject) {
    stream
    .reduce(0, function (sum, chunk) {
      return sum + chunk.length;
    })
    .errors(reject)
    .each(resolve)
  })
}

module.exports = getRespLength;