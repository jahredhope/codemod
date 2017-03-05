const fs = require('fs')

const { log } = require('./logger')

function writeFile(file, content) {
  log('write file', file, content.length)
  fs.writeFileSync(file, content)
}

function readFile(file) {
  return fs.readFileSync(file, 'utf8')
}

module.exports = { writeFile, readFile }
