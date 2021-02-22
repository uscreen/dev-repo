const tap = require('tap')
const { cli } = require('./helper')

tap.test('$ cli', async (t) => {
  const result = await cli([])
  t.strictEqual(
    true,
    result.stderr.startsWith('Usage: cli [options] [command]'),
    'Should print usage information'
  )
  t.end()
})

tap.test('$ cli noop', async (t) => {
  const result = await cli(['noop'])
  t.strictEqual('', result.stdout, 'Should print empty string')
  t.end()
})
