let writeFileWithImports = require('./writeFileWithImports')

jest.mock('./file')

const file = require('./file')

describe('writeFileWithImports', () => {
  beforeEach(() => {
    file.writeFile.mockReset()
  })

  it('should export a function', () => {
    expect(typeof writeFileWithImports).toBe('function')
  })

  it('should require contents', () => {
    expect(() => writeFileWithImports('', {})).toThrow(TypeError)
  })

  it('should write a file', () => {
    writeFileWithImports('example.file', {content: 'initial content'})

    expect(file.writeFile).toHaveBeenCalled()
  })
})
