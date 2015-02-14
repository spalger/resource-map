var fetch = require('./fetch');

function fetchMetadata(job, resource) {
  return fetch('HEAD', resource)
  .then(function (req) {
    resource.stats = req.resp.stats;

    job.junk('fetch', {
      req: req,
      resp: req.resp,
      stats: resource.stats
    })

    return resource
  })
}

module.exports = fetchMetadata