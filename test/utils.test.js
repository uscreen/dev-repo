import tap from 'tap'
import { run } from '../src/utils.js'

tap.test('$ utils code', async (t) => {
  try {
    await run('false', [])
  } catch (error) {
    t.equal(error, 1, 'Should exist spawned process with code 1')
  }
  t.end()
})
