var jobs = require('./lib/jobs')
var cluster = require('cluster')
var h = require('highland')

jobs.startActivityServer()
var cores = require('os').cpus().length
while (cores--) {
  cluster.fork()
}

h([
  'http://spenceralger.com'
])
.each(function (url) {
  jobs.loadPage({
    url: url
  })
})