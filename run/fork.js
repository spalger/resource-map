var cluster = require('cluster')

// start some worker process
var cores = require('os').cpus().length

while (cores--) {
  cluster.fork()
}