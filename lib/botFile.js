var _ = require('lodash')
var parse = require('robots-txt-parse')
var makeGuard = require('robots-txt-guard')

var log = require('./log')('botFile/checker')
var fetch = require('./fetch/fetch')
var botName = process.env.botName

var cache = {};

exports.read = function (url) {
  if (cache[url]) {
    log.debug('reusing previous botFile checker for %s', url);
    return cache[url];
  }

  log.debug('fetching botFile %s', url);
  cache[url] = fetch(log, 'GET', url)
  .then(function (incoming) {
    if (!incoming.res.ok) {
      log.debug('did not find a botFile %s', url)
      // not 2xx response?
      // assume there wasn't a botFile,
      // so all is good
      return _.constant(true)
    }

    return parse(incoming)
    .then(makeGuard)
    .then(function (guard) {
      log.debug('loaded botFile for %s', url);
      var check = _.bindKey(guard, 'isAllowed', botName)
      check.url = url
      return check
    })
  })

  return cache[url];
}