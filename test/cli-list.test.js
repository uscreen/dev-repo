import tap from 'tap'
import { cli } from './helper.js'

tap.test('$ cli list (on empty directory)', async (t) => {
  const result = await cli(['list'], './test/_fixtures/empty')
  t.equal(0, result.code, 'Should succeed')
  t.equal(
    true,
    result.stdout.startsWith('demorepo - missing: no directory'),
    'Should print error information on missing directory'
  )
  t.end()
})

tap.test('$ cli list (with missing checkout)', async (t) => {
  const result = await cli(['list'], './test/_fixtures/norepos')
  t.equal(0, result.code, 'Should succeed')
  t.equal(
    true,
    result.stdout.startsWith('demorepo - missing: no repository'),
    'Should print error information on empty repos'
  )
  t.end()
})

tap.test(
  '$ cli list (with missing checkout and explicit parameter)',
  async (t) => {
    const result = await cli(['list', 'demorepo'], './test/_fixtures/norepos')
    t.equal(0, result.code, 'Should succeed')
    t.equal(
      true,
      result.stdout.startsWith('demorepo - missing: no repository'),
      'Should print error information on empty repos'
    )
    t.end()
  }
)

tap.test(
  '$ cli list (with missing checkout and explicit wrong parameter)',
  async (t) => {
    const result = await cli(['list', 'norepo'], './test/_fixtures/norepos')
    t.equal(1, result.code, 'Should not succeed')
    t.equal(
      true,
      result.stderr.startsWith(
        'ERROR: repository "norepo" does not exist Aborting.'
      ),
      'Should print error information on missing repos'
    )
    t.end()
  }
)
