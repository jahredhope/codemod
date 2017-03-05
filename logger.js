const fs = require('fs')
const path = require('path')

let logOutput = ''
function log(...args) {
  logOutput += args.join(' ') + '\n'
}
function writeLog(...args) {
  log(...args)
  console.log(...args)
  fs.writeFileSync(path.join(__dirname, 'output.log'), logOutput)
}

module.exports = { log, writeLog }
