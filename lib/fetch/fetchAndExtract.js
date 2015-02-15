var fetch = require('./fetch')
var Promise = require('bluebird')

var getRespLength = require('./getRespLength')
var extractResources = require('../resources/extract')

function fetchAndExtract(job, url) {
  return fetch(job, 'GET', url)
  .then(function (incomingBody) {
    var res = incomingBody.res;

    return Promise.all([
      res,
      getRespLength(incomingBody.fork()),
      extractResources(job, res.url, incomingBody.fork())
    ])
  })
  .spread(function (res, length, resources) {
    res.bytes = length
    res.resources = resources
    return res;
  })
}

module.exports = fetchAndExtract