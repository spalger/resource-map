var fetch = require('./fetch')
var Promise = require('bluebird')
var h = require('highland');

var getRespLength = require('./getRespLength')
var extractResources = require('../resources/extract')

function fetchAndExtract(job, url) {
  return fetch(job, 'GET', url)
  .then(function (incoming) {
    var body = h(incoming)
    var res = incoming.res;

    return Promise.all([
      res,
      getRespLength(body.fork()),
      extractResources(job, res.url, body.fork())
    ])
  })
  .spread(function (res, length, resources) {
    res.bytes = length
    res.resources = resources
    return res;
  })
}

module.exports = fetchAndExtract