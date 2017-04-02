const fs = require('fs')
const path = require('path')

let logOutput = []

let reportFileLocation = path.join(process.cwd(), 'output.log')
function log(...args) {
  logOutput.push(args.join(' '))
}
function writeLog(...args) {
  log(...args)
  console.log(...args)
  console.log('writing log to', reportFileLocation)
  fs.writeFileSync(reportFileLocation, logOutput.join('\n'))
}

module.exports = { log, writeLog, reportFileLocation }
