const tap = require('tap')
const { cli, stubGit, cleanupGit } = require('./helper')

tap.test('$ cli install (on empty directory)', async t => {
  stubGit()

  const result = await cli(['install'], './test/_fixtures/addrepos')
  t.strictEqual(0, result.code, 'Should succeed')

  t.strictEqual(
    true,
    result.stdout.startsWith('demorepo - missing: no directory'),
    'Should print error information on missing directory'
  )

  t.strictEqual(
    true,
    result.stdout.includes('mkdir new directory "repos/demorepo"'),
    'Should print mkdir information'
  )

  t.strictEqual(
    true,
    result.stdout.includes('demorepo - missing: no repository'),
    'Should print error information on missing repository'
  )

  t.strictEqual(
    true,
    result.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    'Should print git clone information'
  )

  t.strictEqual(
    true,
    result.stdout.includes('[1/4] Resolving packages'),
    'Should print [1/4] Resolving packages'
  )

  // another run should not clone but install
  const result2 = await cli(['install'], './test/_fixtures/addrepos')
  t.strictEqual(0, result2.code, 'Another run should succeed')

  t.strictEqual(
    false,
    result2.stdout.startsWith('demorepo - missing: no directory'),
    'Another run should NOT print error information on missing directory'
  )

  t.strictEqual(
    false,
    result2.stdout.includes('mkdir new directory "repos/demorepo"'),
    'Another run should NOT print mkdir information'
  )

  t.strictEqual(
    false,
    result2.stdout.includes('demorepo - missing: no repository'),
    'Another run should NOT print error information on missing repository'
  )

  t.strictEqual(
    false,
    result2.stdout.includes('git clone ../../_stubs/demorepo repos/demorepo'),
    'Another run should NOT print git clone information'
  )

  t.strictEqual(
    true,
    result2.stdout.includes('[1/4] Resolving packages'),
    'Another run should print [1/4] Resolving packages'
  )

  t.strictEqual(
    true,
    result2.stdout.includes('success Already up-to-date'),
    'Another run should print yarns success Already up-to-date information'
  )

  cleanupGit()
  t.end()
})
