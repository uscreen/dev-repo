const tap = require('tap')
const { cli } = require('./helper')

tap.test('$ cli list', async t => {
  const result = await cli(['list'], './test/_fixtures/empty')
  t.strictEqual(0, result.code, 'Should succeed')
  t.strictEqual(
    true,
    result.stdout.startsWith('demorepo - missing: no directory'),
    'Should print error information on empty repos'
  )
  t.end()
})
