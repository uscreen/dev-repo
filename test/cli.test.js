import tap from 'tap'
import { cli, before } from './helper.js'

tap.before(before)

tap.test('$ cli', async (t) => {
  const result = await cli([])
  t.equal(
    true,
    result.stderr.startsWith('Usage: cli [options] [command]'),
    'Should print usage information'
  )
  t.end()
})

tap.test('$ cli noop', async (t) => {
  const result = await cli(['noop'])
  t.equal('', result.stdout, 'Should print empty string')
  t.end()
})
