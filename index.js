const m = require('minimist')
const pgp = require('./src/pgp')

// Parse arguments
const argv = m(process.argv.slice(2))
const inputLoc = argv.input || argv.i
const outputLoc = argv.output || argv.o || './output'
const groupCol = argv.group || argv.g || 'Group'
const polylineCol = argv.polyline || argv.p || 'Polyline'

pgp.run({ inputLoc, outputLoc, groupCol, polylineCol })
