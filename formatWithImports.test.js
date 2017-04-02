let formatWithImports = require('./formatWithImports')

jest.mock('./file')

const file = require('./file')

describe('formatWithImports', () => {
  beforeEach(() => {
    file.writeFile.mockReset()
  })

  it('should export a function', () => {
    expect(typeof formatWithImports).toBe('function')
  })

  it('should require contents', () => {
    expect(() => formatWithImports('', {})).toThrow(TypeError)
  })

  it('should return a string', () => {
    const result = formatWithImports({content: 'initial content'})

    expect(typeof result).toBe('string')
  })

  it('should not change content', () => {
    let content = 'initial content'
    const result = formatWithImports({content: content})

    expect(result).toBe(content)
  })

  it('should strip initial whitespace', () => {
    let content = 'initial content'
    const result = formatWithImports({content: '\n\n\n'+content})

    expect(result).toBe(content)
  })

  it('render with imports', () => {
    let content = 'initial\ncontent'
    const result = formatWithImports({
      content: content,
      namedImports: {aVar: './aVar', bVar: './bVar'},
      namelessImports: ['./nameless'],
      globalImports: {cVar: './cVar'}
    })
    expect(result).toMatchSnapshot()
  })

  it('should remove duplicate includes', () => {
    let content = 'initial\ncontent'
    const result = formatWithImports({
      content: content,
      namedImports: {aVar: './aVar', bVar: './bVar'},
      namelessImports: ['./aVar']
    })
    expect(result).toMatchSnapshot()

  })
})
