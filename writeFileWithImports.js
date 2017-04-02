/*
 * Writes a file to the filesystem by first adding any imports given that don't already exist
 */

const { writeFile } = require('./file')
const formatWithImports = require('./formatWithImports')

module.exports = (fileName, fileContentsObject, options = {}) => {

  const newContent = formatWithImports(fileContentsObject, options)
  writeFile(fileName, newContent)
}
