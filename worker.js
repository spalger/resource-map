var jobs = require('./lib/jobs')

jobs.ofType('loadPage', require('./jobTypes/loadPage'));
// jobs.ofType('loadAsset', require('./jobTypes/loadAsset'));