var _ = require('lodash')
var parse = require('robots-txt-parse')
var makeGuard = require('robots-txt-guard')

var log = require('../log')('robots.txt/checker')
var fetch = require('../fetch/fetch')
var botName = process.env.botName

var cache = {};

exports.read = function (url) {
  if (cache[url]) {
    log.debug('reusing previous robots.txt checker for %s', url);
    return cache[url];
  }

  log.info('fetching robots.txt for %s', url);
  cache[url] = fetch(log, 'GET', url)
  .then(function (incoming) {
    if (!incoming.res.ok) {
      // not 2xx response?
      // assume there wasn't a botFile,
      // so all is good
      return _.constant(true)
    }

    return parse(incoming)
    .then(makeGuard)
    .then(function (guard) {
      var check = _.bindKey(guard, 'isAllowed', botName)
      check.url = url
      return check
    })
  })

  return cache[url];
}