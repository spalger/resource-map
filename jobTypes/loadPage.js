var Promise = require('bluebird');
var fetchAndParse = require('../lib/fetch/fetchAndParse');
var jobs = require('../lib/jobs');

module.exports = function (job) {
  return assertFetchable(job)
  .then(function (url) {
    job.log('fetching %s', url);
    return fetchAndParse(url);
  })
  .then(function (resp) {
    resp.links.forEach(jobs.loadPage)
    resp.assets.forEach(jobs.inspectAsset)
  })
}

var assertFetchable = Promise.method(function (job) {
  var url = job.data.url
  if (!url) throw new Error('fetch jobs must have a "url" datum')
  return url
});