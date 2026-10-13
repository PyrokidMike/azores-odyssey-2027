import test from 'node:test'
import assert from 'node:assert/strict'

const suppliedPackage = {
  properties: Array.from({ length: 5 }, (_, index) => ({
    name: `Test accommodation ${index + 1}`,
    sourceUrl: `https://example.com/stay-${index + 1}`,
    availabilityChecks: [{ startDate: '2027-06-01T00:00:00.000Z', endDate: '2027-06-08T00:00:00.000Z', nights: 7, availability: 'unknown' }],
    researchNotes: [{ kind: 'finding', body: `Research note ${index + 1}`, isAgentMax: true }],
  })),
}

test('the supplied five-property package is valid for preview and final import', () => {
  assert.equal(Array.isArray(suppliedPackage.properties), true)
  assert.equal(suppliedPackage.properties.length, 5)
  for (const property of suppliedPackage.properties) {
    assert.ok(new URL(property.sourceUrl))
    assert.equal(typeof property.availabilityChecks[0].startDate, 'string')
    assert.equal(property.researchNotes[0].body.length > 0, true)
  }
  const canonicalPayload = JSON.stringify({ properties: suppliedPackage.properties })
  assert.equal(canonicalPayload, JSON.stringify(JSON.parse(canonicalPayload)))
})
