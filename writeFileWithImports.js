/*
 * Writes a file to the filesystem by first adding any imports given that don't already exist
 */

const assert = require('assert')

const regexImport = /const (\w{3,50}) = require\(["']([^'"]+)["']\);?\n*/g
const regexNamelessImport = /require\(["']([^'"]+)["']\);?/g

const { writeFile } = require('./file')

module.exports = (fileName, { content, imports, namelessImports }, replaceOld) => {
  let newContent
  const existingImports = {}
  const existingNamelessImports = new Set()

  // Look for imports in content
  // Ads imports to existing imports then clears the line
  newContent = content.replace(regexImport, (match, importName, importDirectory) => {
    assert(!existingImports[importName], `import name already exists ${importName} in ${fileName}`)
    existingImports[importName] = importDirectory
    return ''
  })

  // Look for namelessImports in content
  // Ads imports to existing imports then clears the line
  newContent = newContent.replace(regexNamelessImport, (match, importDirectory) => {
    // assert(!existingNamelessImports.has(importDirectory), `nameless import already exists ${importDirectory} in ${fileName}`)
    existingNamelessImports.add(importDirectory)
    return ''
  })
  // Clear newlines from the start of file
  newContent = newContent.replace(/^\n*/, '')

  // Combine or replace with new imports
  const newImports = {}
  const newNamelessImports = existingNamelessImports
  if (namelessImports) {
    newNamelessImports.add.apply(newNamelessImports, namelessImports)
  }
  if (!replaceOld) {
    Object.assign(newImports, existingImports)
  }
  Object.assign(newImports, imports)

  // Add imports to newContent
  let importsAsString = Object.entries(newImports)
    .sort(([importNameA], [importNameB]) => importNameA.localeCompare(importNameB))
    .map(([importName, importDirectory]) => `const ${importName} = require('${importDirectory}');`)
    .join('\n')


  // Add nameless imports to newContent
  const namelessImportsAsString = Array.from(newNamelessImports)
    .sort()
    .map(importDirectory => `require('${importDirectory}');`)
    .join('\n')

  const contentArray = []

  if (importsAsString) {
    contentArray.push(importsAsString)
  }

  if (namelessImportsAsString) {
    contentArray.push(namelessImportsAsString)
  }

  contentArray.push(newContent)


  writeFile(fileName, contentArray.join('\n\n'))
}
