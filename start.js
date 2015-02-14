var cluster = require('cluster');
var master = cluster.isMaster;

if (master) {
  require('./master');
} else {
  require('./worker');
}