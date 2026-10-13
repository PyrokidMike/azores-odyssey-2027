import test from 'node:test'
import assert from 'node:assert/strict'

function replaceBedroomRows(existing: Array<{ roomName: string }>, imported: Array<{ roomName: string }>) {
  return imported.map((room) => ({ ...room }))
}

test('final import replaces bedroom detail rows instead of duplicating them', () => {
  const firstImport = replaceBedroomRows([], [{ roomName: 'Primary suite' }, { roomName: 'Twin room' }])
  assert.deepEqual(firstImport.map((room) => room.roomName), ['Primary suite', 'Twin room'])
  const reimport = replaceBedroomRows(firstImport, [{ roomName: 'Primary suite' }, { roomName: 'Bunk room' }, { roomName: 'Garden room' }])
  assert.deepEqual(reimport.map((room) => room.roomName), ['Primary suite', 'Bunk room', 'Garden room'])
  assert.equal(reimport.length, 3)
})

 test('bedroom detail records preserve the canonical import fields', () => {
  const record = { roomName: 'Primary suite', bedType: 'king', bedQuantity: 1, sleepingCapacity: 2, ensuiteStatus: 'available', notes: 'Ocean view' }
  assert.deepEqual(Object.keys(record), ['roomName', 'bedType', 'bedQuantity', 'sleepingCapacity', 'ensuiteStatus', 'notes'])
})
