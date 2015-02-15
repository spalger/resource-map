var Promise = require('bluebird')
var fetchAndExtract = require('../lib/fetch/fetchAndExtract')
var isPermitted = require('../lib/resources/isPermitted')
var jobs = require('../lib/jobs')

var sightings = 'sightings'

var redis = require('../lib/redis')()
var graph = require('../lib/db').graph;
var meta = require('../lib/db').meta;

var sadd = Promise.promisify(redis.sadd, redis)
var graphPut = Promise.promisify(graph.put, graph);
var metaPut = Promise.promisify(meta.put, meta);

module.exports = function (job) {
  return assertFetchable(job)
  .then(function (url) {
    job.info('fetching %s', url)
    return fetchAndExtract(job, url)
  })
  .then(function (res) {
    job.debug('found %d potential resources at %s', res.resources.length, res.url)

    return Promise.resolve(res.resources)

    // if this is a link, should we ignore it based on where it points?
    .each(function (resc) {
      if (resc.type !== 'anchor') return

      var diffHost = resc.hostname !== 'www.phoenixnewtimes.com'
      var diffDomain = resc.domain !== 'phoenixnewtimes.com'

      resc.ignore = diffHost && diffDomain
    })

    // ignore resources that we have already seen and track those we haven't
    .map(function (resc) {
      if (resc.ignore) return resc

      return sadd(sightings, resc.url)
      .then(function (added) {
        if (!added) resc.ignore = true
        else return metaPut(resc.url, resc);
      })
      .return(resc)
    })

    // record connections
    .map(function (resc) {
      return graphPut({ subject: res.url, predicate: 'link', object: resc.url })
      .return(resc)
    })

    // schedule fetches for resources that aren't ignored
    .map(function (resc) {
      if (resc.ignore) return resc
      return jobs.fetch(resc).return(resc)
    })

    // produce some stats and be done
    .then(function (resources) {
      var ignored = 0
      var assets = 0
      var links = 0

      resources.forEach(function (resc) {
        var asset = resc.type !== 'anchor'

        if (resc.ignore) ignored += 1
        else if (asset) assets += 1
        else links += 1
      })

      job.debug('%s links:%d ignored:%d assets:%d', res.url, links, ignored, assets)
    })
  })
}

var assertFetchable = Promise.method(function (job) {
  var resc = job.data.resource
  if (!resc) throw new Error('fetch jobs must have a "resource" datum')

  return isPermitted(resc)
  .then(function (permitted) {
    if (permitted) return resc.url
    throw new Error('job is blocked by botFile')
  })
})