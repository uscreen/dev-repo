const tap = require('tap')
const { cli, stubGit, cleanupGit } = require('./helper')

tap.test('$ cli list (on empty directory)', async t => {
  stubGit()
  const result = await cli(['install'], './test/_fixtures/addrepos')
  t.strictEqual(0, result.code, 'Should succeed')
  console.log(result.stdout)
  // t.strictEqual(
  //   true,
  //   result.stdout.startsWith('demorepo - missing: no directory'),
  //   'Should print error information on missing directory'
  // )
  cleanupGit()
  t.end()
})
