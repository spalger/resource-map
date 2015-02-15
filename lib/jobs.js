var Promise = require('bluebird')
var _ = require('lodash')
var kue = require('kue')
var makeLogger = require('./log')
var log = makeLogger('jobs')

var work = kue.createQueue({
  redis: {
    createClientFactory: require('./redis')
  }
})

module.exports = {
  kue: kue,
  work: work,

  // create work
  fetch: function (resource) {
    return new Promise(function (resolve, reject) {
      work.create('fetchResource', { resource: resource })
      .save(function (err) {
         if (err) reject(err)
         else resolve()
      })
    })
  },

  // get assigned work
  ofType: function (type, each) {
    work.process(type, 4, function (job, cb) {

      job.logger = makeLogger('job ' + job.id)
      job.debug = _.bindKey(job.logger, 'debug')
      job.warn = _.bindKey(job.logger, 'warn')
      job.info = _.bindKey(job.logger, 'info')

      Promise.try(each, [job])
      .then(
        function () {
          log.info('job %d complete', job.id)
          return
        },
        function (err) {
          log.error({ err: err }, 'job %d failed', job.id)
          throw err
        }
      ).nodeify(cb)
    })
  },

  // provide the ui
  startActivityServer: function () {
    log.info('starting activity server')
    kue.app.listen(3000)
  }
}