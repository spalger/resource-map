var jobs = require('./lib/jobs')

jobs.ofType('fetchResource', require('./jobTypes/fetchResource'));