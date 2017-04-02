module.exports = (txt) => {
  if (typeof txt !== 'string') {
    throw new TypeError(`Unable to encode value of type ${typeof txt}`)
  }
  return txt && txt.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
