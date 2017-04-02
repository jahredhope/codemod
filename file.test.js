const file = require('./file')

jest.mock('fs')

const fs = require('fs')

describe('File wrapper', () => {
  describe('writer', () => {
    beforeEach(() => {
      fs.writeFileSync.mockReset()
    })
    it('should write a file when writeFile called', () => {
      file.writeFile('example.file', 'example content')

      expect(fs.writeFileSync).toHaveBeenCalled()
    })
    it('should write a file for each file', () => {
      file.writeFile('example1.file', 'example content')
      file.writeFile('example2.file', 'example content')

      expect(fs.writeFileSync).toHaveBeenCalledTimes(2)
    })
    it('should write a file with given file name', () => {
      const fileName = 'example.file'
      const content = 'example content'

      file.writeFile(fileName, content)

      expect(fs.writeFileSync).toHaveBeenCalledWith(fileName, content)
    })

  })
  describe('reader', () => {
    beforeEach(() => {
      fs.readFileSync.mockReset()
    })
    it('should read a file when readFile called', () => {
      file.readFile('example.file')

      expect(fs.readFileSync).toHaveBeenCalled()
    })
    it('should read a file as utf8', () => {
      file.readFile('example.file')

      expect(fs.readFileSync).toHaveBeenCalledWith('example.file', 'utf8')
    })
    it('should multiple files', () => {
      file.readFile('example1.file')
      file.readFile('example2.file')

      expect(fs.readFileSync).toHaveBeenCalledTimes(2)
    })

  })
})
