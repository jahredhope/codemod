const { log, writeLog } = require('./logger')
const findFilesWith = require('./findFilesWith')

const { readFile, writeFile } = require('./file')
const babylon = require('babylon')

const parse = (contents) => babylon.parse(contents, {
  plugins: ['objectRestSpread']
})

const print = require('./print')

log('Cleaning all files')

module.exports = (rootDir) => findFilesWith(rootDir, /\.js$/)
  .then(fileNames => {
    fileNames.map(fileName => {
      const contents = readFile(fileName)
      // const tree = parse(contents)
      writeFile(fileName, print(contents))
      return fileName
    })
  })
  .then(fileNames => {
    if (fileNames && fileNames.length) {
      writeLog(`Cleaned ${fileNames.length} files`)
    } else {
      writeLog('No files cleaned')
    }

  })
