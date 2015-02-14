var Promise = require('bluebird')
var kue = require('kue')
var log = require('./log')('job_kue')

var work = kue.createQueue({
  redis: {
    createClientFactory: require('./redis')
  }
})

module.exports = {
  loadPage: resourceJob('loadPage'),
  inspectAsset: resourceJob('inspectAsset'),

  ofType: function (type, each) {
    work.process(type, 4, function (job, cb) {
      Promise.try(each, [job]).nodeify(cb)
    })
  },

  startActivityServer: function () {
    log.info('starting activity server')
    kue.app.listen(3000)
  }
}

function resourceJob(taskName) {
  return function (details) {
    return new Promise(function (resolve, reject) {
      work.create(taskName, details)
      .save(function (err) {
         if (err) return reject(err);
         else resolve();
      })
    })
  };
}