const logger = require('./logger')

jest.mock('fs')

describe('logger', () => {
  let oldLog

  beforeAll(() => {
    oldLog = global.console.log
    global.console.log = jest.fn()
  })
  afterAll(() => {
    global.console.log = oldLog
  })

  it('should export two functions', () => {
    expect(logger.log).toBeDefined()
    expect(logger.writeLog).toBeDefined()
  })
  it('should have a default report location', () => {
    expect(logger.reportFileLocation).toContain('/output.log')
  })
})
