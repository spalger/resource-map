var _ = require('lodash');
var h = require('highland')
var parse = require('url').parse
var format = require('url').format
var fetch = require('./fetch')
var Promise = require('bluebird')
var log = require('../log')('fetchAndParse');

var getRespLength = require('../getRespLength')
var extractResources = require('../resources/extract')
var isUnknown = require('../resources/isUnknown')
var markSeen = require('../resources/markSeen')

function fetchAndParse(url) {
  return fetch('GET', url)
  .then(function (req) {
    var body = h(req.resp);

    return Promise.all([
      req,
      req.resp,
      getRespLength(body.fork()),
      extractResources(body.fork())
    ])
  })
  .spread(function (req, resp, length, subResources) {
    var stats = resp.stats

    var referrerUrl = _.last(resp.redirects) || url;
    var referrer = parse(referrerUrl, false, true)

    stats.byteLength = length

    stats.links = []
    stats.assets = []

    var resources = _(subResources)
    .uniq(false, 'url')
    .map(function (resource) {
      var resUrl = parse(resource.url, false, true)
      var details = {
        protocol: resUrl.protocol || referrer.protocol,
        hostname: resUrl.hostname || referrer.hostname,
        pathname: resUrl.pathname || referrer.pathname,
        search: resUrl.search,
      };

      if (details.protocol !== 'https:' && details.protocol !== 'http:') {
        return;
      }

      return {
        url: format(details),
        type: resource.type,
        referrer: referrerUrl
      }
    })
    .compact()
    .value();

    log.debug('transforming %d resources', resources.length);

    return Promise.resolve(resources)
    .filter(isUnknown)
    .map(markSeen)
    .reduce(function (stats, resource) {
      stats[resource.type === 'anchor' ? 'links' : 'assets'].push(resource)
      return stats;
    }, stats)
    .tap(function (stats) {
      log.debug(_.omit(stats, _.isObject), 'resource stats');
    })
  })
}

module.exports = fetchAndParse