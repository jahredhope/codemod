/*
 * Renders a file by first adding any imports given that don't already exist
 */

const regexNamedImport = /(?:\n|^) *const (\w{3,50}) = require\(["']([^'"]+)["']\);?/g
const regexNamelessImport = /(?:\n|^) *require\(["']([^'"]+)["']\);?/g
const regexGlobalImport = /(?:\n|^) *window.(\w{3,50}) = require\(["']([^'"]+)["']\);?/g

module.exports = ({
  content,
  imports, // Deprecated
  namedImports,
  namelessImports,
  globalImports
}, options = {}) => {

  let newContent
  const existingNamedImports = {}
  const existingNamelessImports = new Set()
  const existingGlobalImports = {}

  if (typeof content !== 'string') {
    throw new TypeError('Must contain intial content')
  }

  if (typeof options === 'boolean') {
    console.warn('DEPRECATED: Third parameter is object field. Use { replaceOld: true }')
    options = {replaceOld: options}
  }
  if (typeof imports !== 'undefined') {
    console.warn('DEPRECATED: imports has been renamed to namedImports')
    if (!namedImports) {
      namedImports = imports
    }
  }

  newContent = content

  newContent = newContent.replace(regexNamelessImport, (match, importDirectory) => {
    existingNamelessImports.add(importDirectory)
    return ''
  })

  newContent = newContent.replace(regexNamedImport, (match, importName, importDirectory) => {
    existingNamedImports[importName] = importDirectory
    return ''
  })

  newContent = newContent.replace(regexGlobalImport, (match, importName, importDirectory) => {
    existingGlobalImports[importName] = importDirectory
    return ''
  })


  // Clear newlines from the start of file
  newContent = newContent.replace(/^\n*/, '')

  // Combine or replace with new imports
  const newNamedImports = {}
  const newNamelessImports = existingNamelessImports
  const newGlobalImports = {}

  if (namelessImports) {
    namelessImports.forEach((namelessImport => { newNamelessImports.add(namelessImport) }))
  }
  if (!options.replaceOld) {
    Object.assign(newNamedImports, existingNamedImports)
    Object.assign(newGlobalImports, existingGlobalImports)
  }
  Object.assign(newNamedImports, namedImports)
  Object.assign(newGlobalImports, globalImports)

  if (newNamelessImports) {
    // Clear nameless imports that are imported elsewhere
    Object.values(newNamedImports)
      .forEach(importLocation => {
        newNamelessImports.delete(importLocation)
      })

    Object.values(newGlobalImports)
      .forEach(importLocation => {
        newNamelessImports.delete(importLocation)
      })
  }

  // Add named imports to newContent
  const namedImportsAsString = Object.entries(newNamedImports)
    .sort(([importNameA], [importNameB]) => importNameA.localeCompare(importNameB))
    .map(([importName, importDirectory]) => `const ${importName} = require('${importDirectory}');`)
    .join('\n')


  // Add nameless imports to newContent
  const namelessImportsAsString = Array.from(newNamelessImports)
    .sort()
    .map(importDirectory => `require('${importDirectory}');`)
    .join('\n')

  // Add imports to newContent
  const globalImportsAsString = Object.entries(newGlobalImports)
    .sort(([importNameA], [importNameB]) => importNameA.localeCompare(importNameB))
    .map(([importName, importDirectory]) => `window.${importName} = require('${importDirectory}');`)
    .join('\n')

  const contentArray = []

  if (namedImportsAsString) {
    contentArray.push(namedImportsAsString)
  }

  if (namelessImportsAsString) {
    contentArray.push(namelessImportsAsString)
  }

  if (globalImportsAsString) {
    contentArray.push(globalImportsAsString)
  }

  contentArray.push(newContent)

  return contentArray.join('\n\n')
}
