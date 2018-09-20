const assert = require('assert')
const mig = require('../migrate-data.js')

console.log("hi")
it("should display checking", function() {
  process.argv[2] = 1
  assert.equal(mig.check(),"1")
  mig.start()
})
