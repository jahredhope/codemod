const recursive = require('recursive-readdir')
const fs = require('fs')

module.exports = function findFilesWith(rootDir, fileRegex, contentRegex) {
  return new Promise((resolve, reject) => {
    const ignoreFunc = (file, stats) => fileRegex && !stats.isDirectory() && !file.match(fileRegex)
    recursive(rootDir, [ignoreFunc], (err, files) => {
      if (err) {
        return reject(err)
      }
      return contentRegex
        ? resolve(files.filter(file => {
          const contents = fs.readFileSync(file, 'utf8')
          return contents.match(contentRegex)
        }))
        : resolve(files)
    })
  })
}
