const testsum = require('./views/js/totalsum.js')
const assert = require('assert')
const prsc = require('./views/js/presc.js')

it('correctly calculates the calculation for monthly medicine of 40 rupees', () => {
  assert.equal(prsc.presc("monthly",40), 1200)
})

it('correctly calculates the calculation for monthly medicine of 300 rupees', () => {
  assert.equal(prsc.presc("monthly",300), 9000)
})

it('correctly calculates the calculation for weekly medicine of 40 rupees', () => {
  assert.equal(prsc.presc("weekly",40), 280)
})

it('correctly calculates the calculation for weekly medicine of 300 rupees', () => {
  assert.equal(prsc.presc("weekly",300), 2100)
})



it('correctly calculates the sum of 123 and 345', () => {
  assert.equal(testsum.totalsum(123,345), 468)
})

it('correctly calculates the sum of 153 and 365', () => {
  assert.equal(testsum.totalsum(153,365), 518)
})

it('correctly calculates the sum of 353 and 465', () => {
  assert.equal(testsum.totalsum(353,465), 818)
})

it('correctly calculates the sum of 1253 and 3465', () => {
  assert.equal(testsum.totalsum(1253,3465), 4718)
})
